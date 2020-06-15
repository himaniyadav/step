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

        List<TimeRange> toRemove = new ArrayList<TimeRange>();
        List<TimeRange> toAdd = new ArrayList<TimeRange>();
        for (TimeRange range : availableTimes) {
          if (range.overlaps(eventRange)) {
            // If the event overlaps with one of our currently "available" times:  
            TimeRange newRange;
            int start;
            int end;
            
            if (range.contains(eventRange)) {
              // Case 1: event is fully contained within current range
              // Split up current TimeRange into two.
              start = range.start();
              end = eventRange.start();
              newRange = TimeRange.fromStartEnd(start, end, false);
              toAdd.add(newRange);
              
              start = eventRange.end();
              end = range.end();
              newRange = TimeRange.fromStartEnd(start, end, false);
              toAdd.add(newRange);
            } else if (eventRange.contains(range)) {
              // Case 2: event spans the whole TimeRange
              // Do nothing, besides deleting current TimeRange.
            } else if (eventRange.start() < range.start()) {
              // Case 3: event starts earlier than current range
              // Shift current TimeRange to start later.
              start = eventRange.end();
              end = range.end();
              newRange = TimeRange.fromStartEnd(start, end, false);
              toAdd.add(newRange);
            } else if (eventRange.end() > range.end()) {
              // Case 4: event ends later than current range
              // Shift current TimeRange to end earlier.
              start = range.start();
              end = eventRange.start();
              newRange = TimeRange.fromStartEnd(start, end, false);
              toAdd.add(newRange);
            }
            toRemove.add(range);
          }
        }
        availableTimes.addAll(toAdd);
        availableTimes.removeAll(toRemove);
      }
    }

    // If a time is not long enough for the meeting, remove it as an option. 
    availableTimes.removeIf((TimeRange range) -> (range.duration() < request.getDuration()));

    return availableTimes;
  }
}
