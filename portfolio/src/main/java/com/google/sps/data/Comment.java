package com.google.sps.data;

/** Class containing comments. */
public final class Comment {

  private final String name;
  private String message;
  private final String email;
  private final long timestamp;
  private final long id;

  public Comment(String name, String message, String email, long timestamp, long id) {
    this.name = name;
    this.message = message;
    this.email = email;
    this.timestamp = timestamp;
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public String getMessage() {
    return message;
  }

  public String getEmail() {
    return email;
  }

  public long getTime() {
    return timestamp;
  }

  public long getId() {
    return id;
  }
};