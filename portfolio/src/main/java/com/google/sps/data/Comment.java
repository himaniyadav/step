package com.google.sps.data;

/** Class containing comments. */
public final class Comment {

  private final String name;
  private String message;
  private final long timestamp;
  private final long id;

  public Comment(String name, String message, long timestamp, long id) {
    this.name = name;
    this.message = message;
    this.timestamp = timestamp;
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public String getMessage() {
    return message;
  }

  public long getTime() {
    return timestamp;
  }

  public long getId() {
    return id;
  }
};