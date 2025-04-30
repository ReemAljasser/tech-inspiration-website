package com.example.techinspiration.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "index2.html"; // هذا يستدعي index.html من templates
    }
}
