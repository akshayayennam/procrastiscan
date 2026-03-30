package com.procrastiscan.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.procrastiscan.model.Task;
import com.procrastiscan.service.TaskService;
import com.procrastiscan.dto.AnalysisResponse;
import com.procrastiscan.dto.ProductivityResponse;
import com.procrastiscan.dto.TaskWarningResponse;
import com.procrastiscan.dto.ProductivityTrendResponse;
import com.procrastiscan.dto.ProcrastinationScoreResponse;

@RestController
@RequestMapping("/tasks")
@CrossOrigin("*")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private com.procrastiscan.service.UserService userService;

    @PostMapping
    public Task createTask(@RequestBody Task task, @RequestHeader(value = "X-User-Id") Long userId) {
        com.procrastiscan.model.User user = userService.getUserById(userId);
        task.setUser(user);
        return taskService.saveTask(task);
    }

    @GetMapping
    public List<Task> getAllTasks(@RequestHeader(value = "X-User-Id") Long userId) {
        return taskService.getTasksByUser(userId);
    }

    @GetMapping("/{id}")
    public Task getTask(@PathVariable Long id) {
        return taskService.getTaskById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return "Task deleted successfully";
    }

    @PutMapping("/{id}/postpone")
    public Task postponeTask(@PathVariable Long id) {
        return taskService.postponeTask(id);
    }

    @PutMapping("/{id}/complete")
    public Task completeTask(@PathVariable Long id) {
        return taskService.completeTask(id);
    }

    @GetMapping("/analysis")
    public AnalysisResponse analyzeTasks(@RequestHeader(value = "X-User-Id") Long userId) {
        return taskService.analyzeTasks(userId);
    }

    @GetMapping("/overdue")
    public List<Task> getOverdueTasks(@RequestHeader(value = "X-User-Id") Long userId) {
        return taskService.getOverdueTasks(userId);
    }

    @GetMapping("/user/{userId}")
    public List<Task> getTasksByUser(@PathVariable Long userId) {
        return taskService.getTasksByUser(userId);
    }

    @GetMapping("/top-procrastinated")
    public List<Task> getTopProcrastinatedTasks(@RequestHeader(value = "X-User-Id") Long userId) {
        return taskService.getTopProcrastinatedTasks(userId);
    }

    @GetMapping("/productivity-score")
    public ProductivityResponse getProductivityScore(@RequestHeader(value = "X-User-Id") Long userId) {
        return taskService.getProductivityScore(userId);
    }
    
    @GetMapping("/warnings")
    public List<TaskWarningResponse> getWarnings(@RequestHeader(value = "X-User-Id") Long userId) {
        return taskService.getTaskWarnings(userId);
    }

    @GetMapping("/productivity-trend")
    public List<ProductivityTrendResponse> getProductivityTrend(@RequestHeader(value = "X-User-Id") Long userId) {
        return taskService.getProductivityTrend(userId);
    }

    @GetMapping("/procrastination-score")
    public List<ProcrastinationScoreResponse> getProcrastinationScores(@RequestHeader(value = "X-User-Id") Long userId) {
        return taskService.getProcrastinationScores(userId);
    }
}
