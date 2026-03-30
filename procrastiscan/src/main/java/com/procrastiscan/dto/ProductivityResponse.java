package com.procrastiscan.dto;

public class ProductivityResponse {

    private double productivityScore;
    private long completedTasks;
    private long pendingTasks;
    private double averagePostponeCount;

    public ProductivityResponse(double productivityScore, long completedTasks,
                                long pendingTasks, double averagePostponeCount) {
        this.productivityScore = productivityScore;
        this.completedTasks = completedTasks;
        this.pendingTasks = pendingTasks;
        this.averagePostponeCount = averagePostponeCount;
    }

    public double getProductivityScore() {
        return productivityScore;
    }

    public long getCompletedTasks() {
        return completedTasks;
    }

    public long getPendingTasks() {
        return pendingTasks;
    }

    public double getAveragePostponeCount() {
        return averagePostponeCount;
    }
}