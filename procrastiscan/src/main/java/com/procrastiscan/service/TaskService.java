package com.procrastiscan.service;

import java.util.List;
import java.util.ArrayList;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.procrastiscan.model.Task;
import com.procrastiscan.repository.TaskRepository;
import com.procrastiscan.dto.AnalysisResponse;
import com.procrastiscan.dto.ProductivityResponse;
import com.procrastiscan.dto.TaskWarningResponse;
import com.procrastiscan.dto.DashboardSummaryResponse;
import com.procrastiscan.dto.ProductivityTrendResponse;
import com.procrastiscan.dto.ProcrastinationScoreResponse;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    public Task saveTask(Task task) {
        if (task.getStatus() == null) {
            task.setStatus("PENDING");
        }
        if (task.getCreatedDate() == null) {
            task.setCreatedDate(LocalDate.now());
        }
        return taskRepository.save(task);
    }

    public List<Task> getTasksByUser(Long userId) {
        return taskRepository.findByUserId(userId);
    }

    public Task getTaskById(Long id) {
        return taskRepository.findById(id).orElse(null);
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    public Task postponeTask(Long id) {
        Task task = taskRepository.findById(id).orElse(null);
        if (task != null) {
            task.setPostponeCount(task.getPostponeCount() + 1);
            return taskRepository.save(task);
        }
        return null;
    }

    public Task completeTask(Long id) {
        Task task = taskRepository.findById(id).orElse(null);
        if (task != null) {
            task.setStatus("COMPLETED");
            task.setCompletedDate(LocalDate.now());
            return taskRepository.save(task);
        }
        return null;
    }

    public AnalysisResponse analyzeTasks(Long userId) {
        List<Task> tasks = taskRepository.findByUserId(userId);
        int total = tasks.size();
        int completed = 0;
        int pending = 0;
        int overdue = 0;
        int score = 0;
        LocalDate today = LocalDate.now();

        for (Task t : tasks) {
            if ("COMPLETED".equalsIgnoreCase(t.getStatus())) {
                completed++;
                if (t.getCompletedDate() != null && t.getDeadline() != null && t.getCompletedDate().isAfter(t.getDeadline())) {
                    score += 3;
                }
            } else {
                pending++;
                if (t.getDeadline() != null && t.getDeadline().isBefore(today)) {
                    overdue++;
                    score += 4;
                }
            }
            if (t.getPostponeCount() > 2) {
                score += 2;
            }
        }

        String risk = score <= 2 ? "LOW" : (score <= 5 ? "MODERATE" : "HIGH");
        return new AnalysisResponse(total, completed, pending, overdue, score, risk);
    }

    public List<Task> getOverdueTasks(Long userId) {
        List<Task> tasks = taskRepository.findByUserId(userId);
        List<Task> overdueTasks = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (Task t : tasks) {
            if (t.getDeadline() != null && t.getDeadline().isBefore(today) && !"COMPLETED".equalsIgnoreCase(t.getStatus())) {
                overdueTasks.add(t);
            }
        }
        return overdueTasks;
    }

    public List<Task> getTopProcrastinatedTasks(Long userId) {
        return taskRepository.findTopProcrastinatedTasks(userId);
    }

    public ProductivityResponse getProductivityScore(Long userId) {
        long completedTasks = taskRepository.countByUserIdAndStatus(userId, "COMPLETED");
        long pendingTasks = taskRepository.countByUserIdAndStatus(userId, "PENDING");
        long totalTasks = completedTasks + pendingTasks;

        Double avgPostpone = taskRepository.findAveragePostponeCountByUserId(userId);
        if (avgPostpone == null) avgPostpone = 0.0;

        double productivityScore = 0;
        if (totalTasks > 0) {
            productivityScore = ((double) completedTasks / totalTasks) * 100;
            productivityScore -= (avgPostpone * 5);
        }
        if (productivityScore < 0) productivityScore = 0;
        productivityScore = Math.round(productivityScore * 100.0) / 100.0;

        return new ProductivityResponse(productivityScore, completedTasks, pendingTasks, avgPostpone);
    }

    public List<TaskWarningResponse> getTaskWarnings(Long userId) {
        List<Task> tasks = taskRepository.findHighRiskTasksByUserId(userId);
        LocalDate today = LocalDate.now();
        LocalDate threshold = today.plusDays(2);
        List<TaskWarningResponse> warnings = new ArrayList<>();

        for (Task task : tasks) {
            if (task.getDeadline() != null && (task.getDeadline().isBefore(threshold) || task.getDeadline().isEqual(threshold))) {
                warnings.add(new TaskWarningResponse(
                        task.getId(),
                        task.getTitle(),
                        task.getPostponeCount(),
                        task.getDeadline(),
                        "High procrastination risk"
                ));
            }
        }
        return warnings;
    }

    public DashboardSummaryResponse getDashboardSummary(Long userId) {
        long completed = taskRepository.countByUserIdAndStatus(userId, "COMPLETED");
        long pending = taskRepository.countByUserIdAndStatus(userId, "PENDING");
        
        // We need a way to count overdue for user
        long overdue = 0;
        List<Task> tasks = taskRepository.findByUserId(userId);
        LocalDate today = LocalDate.now();
        for (Task t : tasks) {
            if (t.getDeadline() != null && t.getDeadline().isBefore(today) && !"COMPLETED".equalsIgnoreCase(t.getStatus())) {
                overdue++;
            }
        }

        long total = tasks.size();
        List<Task> topTasks = taskRepository.findTopProcrastinatedTasks(userId);
        String topTask = topTasks.isEmpty() ? null : topTasks.get(0).getTitle();
        ProductivityResponse productivity = getProductivityScore(userId);

        return new DashboardSummaryResponse(total, completed, pending, overdue, topTask, productivity.getProductivityScore());
    }

    public List<ProductivityTrendResponse> getProductivityTrend(Long userId) {
        List<Object[]> results = taskRepository.findProductivityTrendByUserId(userId);
        List<ProductivityTrendResponse> trend = new ArrayList<>();
        for (Object[] row : results) {
            LocalDate date = (LocalDate) row[0];
            long count = (Long) row[1];
            trend.add(new ProductivityTrendResponse(date, count));
        }
        return trend;
    }

    public List<ProcrastinationScoreResponse> getProcrastinationScores(Long userId) {
        List<Task> tasks = taskRepository.findByUserId(userId);
        List<ProcrastinationScoreResponse> scores = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (Task task : tasks) {
            int overdueDays = 0;
            if (task.getDeadline() != null && task.getDeadline().isBefore(today)) {
                overdueDays = (int) ChronoUnit.DAYS.between(task.getDeadline(), today);
            }
            int score = (task.getPostponeCount() * 10) + (overdueDays * 5);
            scores.add(new ProcrastinationScoreResponse(task.getId(), task.getTitle(), task.getPostponeCount(), overdueDays, score));
        }
        return scores;
    }
}
