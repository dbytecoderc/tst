import React from 'react'
import '../../datetime.css';
import DateTimeRangePicker from 'react-datetime-range-picker';


  export default function DateTimeRangeForm ({ updateDateTime, dateTimeValue}) {
    return (
      <div>
        <DateTimeRangePicker
          inline={true}
          className="date-time-picker-wrapper"
          pickerClassName="date-time-picker"
          onChange={updateDateTime} 
          value={dateTimeValue}
        />
      </div>
    )
  }
