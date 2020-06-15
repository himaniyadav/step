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
    List<TimeRange> times = new ArrayList<>();
    
    times.add(TimeRange.WHOLE_DAY);

    for (Event event : events) {
      if (!Collections.disjoint(event.getAttendees(), request.getAttendees())) {
        TimeRange eventRange = event.getWhen();

        List<TimeRange> toRemove = new ArrayList<TimeRange>();
        List<TimeRange> toAdd = new ArrayList<TimeRange>();
        for (TimeRange range : times) {
          if (range.overlaps(eventRange)) {
            TimeRange newRange;
            int start;
            int end;
            
            if (range.contains(eventRange)) {
            // Case 1: event is fully contained within current range
            // Splits up current TimeRange into two.
              start = range.start();
              end = eventRange.start();
              newRange = TimeRange.fromStartEnd(start, end, false);
              toAdd.add(newRange);
              
              start = eventRange.end();
              end = range.end();
              newRange = TimeRange.fromStartEnd(start, end, false);
              toAdd.add(newRange);
            } else if (eventRange.start() < range.start()) {
            // Case 2: event starts earlier than current range
            // Shift current TimeRange to start later.
              start = eventRange.end();
              end = range.end();
              newRange = TimeRange.fromStartEnd(start, end, false);
              toAdd.add(newRange);
            } else if (eventRange.end() > range.end()) {
            // Case 3: event ends later than current range
            // Shift current TimeRange to end earlier.
              start = range.start();
              end = eventRange.start();
              newRange = TimeRange.fromStartEnd(start, end, false);
              toAdd.add(newRange);
            }
            toRemove.add(range);
          }
        }
        times.addAll(toAdd);
        times.removeAll(toRemove);
      }
    }

    // Go through all available times.
    // If it is not long enough for the meeting, remove it as an option. 
    times.removeIf((TimeRange range) -> range.duration() < request.getDuration());

    return times;
  }
}
