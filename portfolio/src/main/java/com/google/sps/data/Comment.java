package com.google.sps.data;

/** Class containing comments. */
public final class Comment {

  private final String name;
  private String message;

  public Comment(String name, String message) {
    this.name = name;
    this.message = message;
  }

  public String getName() {
    return name;
  }

  public String getMessage() {
    return message;
  }

};