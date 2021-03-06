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
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.FetchOptions.Builder;
import java.util.ArrayList;
import java.util.List;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that returns comments data */
@WebServlet("/data")
public class DataServlet extends HttpServlet {
  
  List<Comment> comments = new ArrayList<>();

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    // Get the input from the form.
    int maxComments = getMaxComments(request);
    int pageNumber = getPageNum(request);

    // Preparing query instance to retrieve comments
    Query query = new Query("Comment").addSort("timestamp", SortDirection.DESCENDING);

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);
    FetchOptions options = FetchOptions.Builder.withLimit(maxComments)
                                               .offset(pageNumber * maxComments);

    List<Comment> comments = new ArrayList<>();
    for (Entity entity : results.asIterable(options)) {
      String name = (String) entity.getProperty("name");
      String message = (String) entity.getProperty("message");
      String email = (String) entity.getProperty("email");
      long timestamp = (long) entity.getProperty("timestamp");
      long id = entity.getKey().getId();

      addComment(comments, name, message, email, timestamp, id);
    }

    // Send the JSON as the response
    response.setContentType("application/json;");
    response.getWriter().println(convertToJson(comments));
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    UserService userService = UserServiceFactory.getUserService();
    // Get the input from the form.
    String name = request.getParameter("name");
    String message = request.getParameter("message");
    long timestamp = System.currentTimeMillis();
    String email = userService.getCurrentUser().getEmail();

    Entity commentEntity = new Entity("Comment");
    commentEntity.setProperty("name", name);
    commentEntity.setProperty("message", message);
    commentEntity.setProperty("timestamp", timestamp);
    commentEntity.setProperty("email", email);

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    datastore.put(commentEntity);
  }

  /**
   * Gets the maximum number of comments to retrieve, as requested by the user.
   */
  private int getMaxComments(HttpServletRequest request) {
    // Get input from the form.
    String maxCommentsString = request.getParameter("max-comments");

    // Convert the input to an int
    int maxComments;
    try {
      maxComments = Integer.parseInt(maxCommentsString);
    } catch (NumberFormatException e) {
      System.err.println("Could not convert to int: " + maxCommentsString);
      return 5; // set the default value to 5 if there was an error
    }

    return maxComments;
  }

  /**
   * Gets the page number of comments to display.
   */
  private int getPageNum(HttpServletRequest request) {
    // Get input from the form.
    String pageString = request.getParameter("page-num");

    // Convert the input to an int
    int page;
    try {
      page = Integer.parseInt(pageString);
    } catch (NumberFormatException e) {
      System.err.println("Could not convert to int: " + pageString);
      return 0; // set the default value to 0 (first page) if there was an error
    }

    return page;
  }

  /**
   * Adds a comment to a list of comments.
   */
  private void addComment(List comments, String name, String message, String email, 
                          long timestamp, long id) {
    Comment comment = new Comment(name, message, email, timestamp, id);
    comments.add(comment);
  }

  /**
   * Converts a Comment list instance into a JSON string using the Gson library.
   */
  private String convertToJson(List comments) {
    return new Gson().toJson(comments);
  }
}
