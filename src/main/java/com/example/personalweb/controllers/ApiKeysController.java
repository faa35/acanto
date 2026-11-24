package com.example.personalweb.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Public profile details only.
 *
 * API keys are intentionally NOT returned here anymore: anything this endpoint
 * returns is readable by every visitor. The Next.js frontend now keeps its keys
 * server-side (frontend/src/app/api/*) via Vercel environment variables.
 */
@RestController
public class ApiKeysController {

    @Value("${LAST_FM_USERNAME}")
    private String lastFmUsername;

    @Value("${DISCORD_USER_ID}")
    private String discordUserId;

    @GetMapping("/api/details")
    public Map<String, String> getDetails() {
        return Map.of(
            "lastFmUsername", lastFmUsername,
            "discordUserId", discordUserId
        );
    }
}
