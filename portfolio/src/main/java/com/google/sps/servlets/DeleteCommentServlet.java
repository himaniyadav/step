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

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** 
 * Servlet that deletes an individual comment from datastore. 
 */
@WebServlet("/delete-comment")
public class DeleteCommentServlet extends HttpServlet {

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    UserService userService = UserServiceFactory.getUserService();
    String email = userService.getCurrentUser().getEmail();
    
    // Get the comment id and email to be deleted.
    long id = Long.parseLong(request.getParameter("id"));
    String commentEmail = request.getParameter("email");

    // only delete comment if current user created the comment
    if (commentEmail.equals(email)) {
      Key entityKey = KeyFactory.createKey("Comment", id);
      DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
      datastore.delete(entityKey);
    }

    String json = "{\"success\": ";
    if (commentEmail.equals(email)) {
      json += "\"true\"";
    } else {
      json += "\"false\"";
    }
    json += "}";

    // send JSON response success/fail
    response.setContentType("application/json;");
    response.getWriter().println(json);
  }
}
