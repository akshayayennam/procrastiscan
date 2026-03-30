package com.procrastiscan.dto;

import java.time.LocalDate;

public class ProductivityTrendResponse {

    private LocalDate date;
    private long completedTasks;

    public ProductivityTrendResponse(LocalDate date, long completedTasks) {
        this.date = date;
        this.completedTasks = completedTasks;
    }

    public LocalDate getDate() {
        return date;
    }

    public long getCompletedTasks() {
        return completedTasks;
    }
}