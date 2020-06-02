// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;

import com.google.sps.data.Comment;
import com.google.gson.Gson;
import java.util.ArrayList;
import java.util.List;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that returns some example content. TODO: modify this file to handle comments data */
@WebServlet("/data")
public class DataServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

    // Create a list of hard-coded comments.
    List<Comment> comments = new ArrayList<>();

    String name1 = "Himani Yadav";
    String message1 = "Wow, this is a great website :)";
    Comment comment1 = new Comment(name1, message1);

    String name2 = "Jon Snow";
    String message2 = "I know nothing :)";
    Comment comment2 = new Comment(name2, message2);
    
    String name3 = "Arya Stark";
    String message3 = "Winter is coming.";
    Comment comment3 = new Comment(name3, message3);

    comments.add(comment1);
    comments.add(comment2);
    comments.add(comment3);

    // Convert the list of comments to JSON
    String json = convertToJson(comments);

    // Send the JSON as the response
    response.setContentType("application/json;");
    response.getWriter().println(json);

  }

  /**
   * Converts a Comment instance into a JSON string using the Gson library.
   */
  private String convertToJson(List comments) {
    Gson gson = new Gson();
    String json = gson.toJson(comments);
    return json;
  }
}
