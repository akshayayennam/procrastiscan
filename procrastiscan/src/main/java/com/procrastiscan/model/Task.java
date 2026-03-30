package com.procrastiscan.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    private LocalDate createdDate;

    private LocalDate deadline;

    private LocalDate completedDate;

    private String status;

    private String priority;

    private int postponeCount;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    public Task() {}

    public Task(Long id, String title, String description, LocalDate createdDate,
                LocalDate deadline, LocalDate completedDate, String status, String priority, int postponeCount, User user) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.createdDate = createdDate;
        this.deadline = deadline;
        this.completedDate = completedDate;
        this.status = status;
        this.priority = priority;
        this.postponeCount = postponeCount;
        this.user = user;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDate createdDate) { this.createdDate = createdDate; }

    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }

    public LocalDate getCompletedDate() { return completedDate; }
    public void setCompletedDate(LocalDate completedDate) { this.completedDate = completedDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public int getPostponeCount() { return postponeCount; }
    public void setPostponeCount(int postponeCount) { this.postponeCount = postponeCount; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
