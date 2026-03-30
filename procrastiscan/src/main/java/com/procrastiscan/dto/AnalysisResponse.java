package com.procrastiscan.dto;

public class AnalysisResponse {

    private int totalTasks;
    private int completedTasks;
    private int pendingTasks;
    private int overdueTasks;
    private int procrastinationScore;
    private String riskLevel;

    public AnalysisResponse(int totalTasks, int completedTasks, int pendingTasks,
                            int overdueTasks, int procrastinationScore, String riskLevel) {
        this.totalTasks = totalTasks;
        this.completedTasks = completedTasks;
        this.pendingTasks = pendingTasks;
        this.overdueTasks = overdueTasks;
        this.procrastinationScore = procrastinationScore;
        this.riskLevel = riskLevel;
    }

    public int getTotalTasks() { return totalTasks; }
    public int getCompletedTasks() { return completedTasks; }
    public int getPendingTasks() { return pendingTasks; }
    public int getOverdueTasks() { return overdueTasks; }
    public int getProcrastinationScore() { return procrastinationScore; }
    public String getRiskLevel() { return riskLevel; }
}