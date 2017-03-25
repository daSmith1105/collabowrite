import React from 'react';
import moment from 'moment';

export default function generateTimeStamp(postTime) {
  if (moment(postTime).add(60, 'minutes').isBefore(moment())) {
     return moment(postTime).fromNow();
  } else {
    let timeStamp = '<b>' + moment(postTime).fromNow() + '</b>';
    if (timeStamp === '<b>in a few seconds</b>') { timeStamp === '<b>a few seconds ago</b>'; }
    return timeStamp;
  }
}