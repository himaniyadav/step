package com.google.sps.data;

/** Class containing comments. */
public final class Comment {

  private final String name;
  private String message;
  private final long timestamp;

  public Comment(String name, String message, long timestamp) {
    this.name = name;
    this.message = message;
    this.timestamp = timestamp;
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
};