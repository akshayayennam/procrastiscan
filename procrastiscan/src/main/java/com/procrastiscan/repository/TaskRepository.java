package com.procrastiscan.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.procrastiscan.model.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByUserId(Long userId);

    @Query("SELECT t FROM Task t WHERE t.user.id = :userId AND t.postponeCount > 0 ORDER BY t.postponeCount DESC")
    List<Task> findTopProcrastinatedTasks(@Param("userId") Long userId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.user.id = :userId AND t.status = :status")
    long countByUserIdAndStatus(@Param("userId") Long userId, @Param("status") String status);

    @Query("SELECT AVG(t.postponeCount) FROM Task t WHERE t.user.id = :userId")
    Double findAveragePostponeCountByUserId(@Param("userId") Long userId);

    @Query("SELECT t FROM Task t WHERE t.user.id = :userId AND t.postponeCount >= 3 AND t.status = 'PENDING'")
    List<Task> findHighRiskTasksByUserId(@Param("userId") Long userId);

    @Query("SELECT t.completedDate, COUNT(t) FROM Task t WHERE t.user.id = :userId AND t.status = 'COMPLETED' AND t.completedDate IS NOT NULL GROUP BY t.completedDate ORDER BY t.completedDate")
    List<Object[]> findProductivityTrendByUserId(@Param("userId") Long userId);

    @Query("SELECT t FROM Task t WHERE t.deadline < CURRENT_DATE AND t.status != 'COMPLETED'")
    List<Task> findOverdueTasksForScheduler();
}
