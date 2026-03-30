package com.procrastiscan.dto;

public class DashboardSummaryResponse {

    private long totalTasks;
    private long completedTasks;
    private long pendingTasks;
    private long overdueTasks;
    private String topProcrastinatedTask;
    private double productivityScore;

    public DashboardSummaryResponse(long totalTasks,
                                    long completedTasks,
                                    long pendingTasks,
                                    long overdueTasks,
                                    String topProcrastinatedTask,
                                    double productivityScore) {

        this.totalTasks = totalTasks;
        this.completedTasks = completedTasks;
        this.pendingTasks = pendingTasks;
        this.overdueTasks = overdueTasks;
        this.topProcrastinatedTask = topProcrastinatedTask;
        this.productivityScore = productivityScore;
    }

    public long getTotalTasks() {
        return totalTasks;
    }

    public long getCompletedTasks() {
        return completedTasks;
    }

    public long getPendingTasks() {
        return pendingTasks;
    }

    public long getOverdueTasks() {
        return overdueTasks;
    }

    public String getTopProcrastinatedTask() {
        return topProcrastinatedTask;
    }

    public double getProductivityScore() {
        return productivityScore;
    }
}