package com.procrastiscan.controller;

import org.springframework.web.bind.annotation.*;

import com.procrastiscan.dto.DashboardSummaryResponse;
import com.procrastiscan.service.TaskService;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin("*")
public class DashboardController {

    private final TaskService taskService;

    public DashboardController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping("/summary")
    public DashboardSummaryResponse getDashboardSummary(@RequestHeader(value = "X-User-Id") Long userId) {
        return taskService.getDashboardSummary(userId);
    }
}
