package com.procrastiscan.dto;

public class ProcrastinationScoreResponse {

    private Long taskId;
    private String title;
    private int postponeCount;
    private int overdueDays;
    private int procrastinationScore;

    public ProcrastinationScoreResponse(Long taskId,
                                         String title,
                                         int postponeCount,
                                         int overdueDays,
                                         int procrastinationScore) {

        this.taskId = taskId;
        this.title = title;
        this.postponeCount = postponeCount;
        this.overdueDays = overdueDays;
        this.procrastinationScore = procrastinationScore;
    }

    public Long getTaskId() {
        return taskId;
    }

    public String getTitle() {
        return title;
    }

    public int getPostponeCount() {
        return postponeCount;
    }

    public int getOverdueDays() {
        return overdueDays;
    }

    public int getProcrastinationScore() {
        return procrastinationScore;
    }
}