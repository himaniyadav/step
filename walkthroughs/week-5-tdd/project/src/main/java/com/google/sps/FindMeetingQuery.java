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

package com.google.sps;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.ArrayList;
import java.util.Set;
import java.util.LinkedHashSet;

public final class FindMeetingQuery {
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
    List<TimeRange> availableTimes = new ArrayList<>();
    
    // At first, the whole day is available for meetings.
    availableTimes.add(TimeRange.WHOLE_DAY);

    // Go through each event to eliminate times when people aren't available.
    for (Event event : events) {
      if (!Collections.disjoint(event.getAttendees(), request.getAttendees())) {
        // If at least one attendee of the requested meeting is an attendee of an event:
        TimeRange eventRange = event.getWhen();

        Set<TimeRange> newAvailableRanges = new LinkedHashSet<TimeRange>();
        Set<TimeRange> conflictingRanges = new LinkedHashSet<TimeRange>();
        for (TimeRange availableTime : availableTimes) {
          if (availableTime.overlaps(eventRange)) {
            conflictingRanges.add(availableTime);
            splitUpTimeRange(availableTime, eventRange, newAvailableRanges);
          }
        }
        availableTimes.addAll(newAvailableRanges);
        availableTimes.removeAll(conflictingRanges);
      }
    }

    // If a time is not long enough for the meeting, remove it as an option. 
    availableTimes.removeIf((TimeRange range) -> (range.duration() < request.getDuration()));

    return availableTimes;
  }

  /** 
   * Handles splitting up an available {@code TimeRange} given a conflicting event's 
   * {@code TimeRange}, into new available ranges.
   */
  private void splitUpTimeRange(TimeRange availableTime, 
                                TimeRange eventRange, 
                                Set<TimeRange> newAvailableRanges) {
    int start;
    int end;
            
    if (availableTime.contains(eventRange)) {
      start = availableTime.start();
      end = eventRange.start();
      addTimeRangeToList(newAvailableRanges, start, end, false);

      start = eventRange.end();
      end = availableTime.end();
      addTimeRangeToList(newAvailableRanges, start, end, false);
    } else if (eventRange.contains(availableTime)) {
      // If an event spans the whole available time, no new range will be available.
    } else if (eventRange.start() < availableTime.start()) {
      start = eventRange.end();
      end = availableTime.end();
      addTimeRangeToList(newAvailableRanges, start, end, false);
    } else if (eventRange.end() > availableTime.end()) {
      start = availableTime.start();
      end = eventRange.start();
      addTimeRangeToList(newAvailableRanges, start, end, false);
    }
  }

  /** 
   * Creates and adds a {@code TimeRange} to a collection, starting at {@code start} 
   * and ending at {@code end}. 
   */
  private void addTimeRangeToList(Collection<TimeRange> collection, int start, int end, 
                                  boolean inclusive) {
    TimeRange range = TimeRange.fromStartEnd(start, end, inclusive);
    collection.add(range);
  }
}
