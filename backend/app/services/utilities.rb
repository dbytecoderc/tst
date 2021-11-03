class Utilities
    def self.time_difference_in_minutes(start_time, end_time)
        s = Time.parse(start_time)
        e = Time.parse(end_time)
        difference = e.to_i - s.to_i
        difference_in_minutes = difference / 60
        if difference_in_minutes < 1
            1
        else
            difference_in_minutes
        end
    end

    def self.time_difference_in_hours(start_time, end_time)
        difference = time_difference_in_minutes(start_time, end_time) / 60

        if difference < 1
            1
        else
            difference
        end
    end

    def self.time_difference_in_days(start_time, end_time)
        difference = time_difference_in_hours(start_time, end_time) / 24

        if difference < 1
            1
        else
            difference
        end
    end

    def self.time_difference(start_time, end_time, time_unit)
        case time_unit
        when "minute"
            time_difference_in_minutes(start_time, end_time)
        when "hour"
            time_difference_in_hours(start_time, end_time)
        when "day"
            time_difference_in_days(start_time, end_time)
        else
            0
        end
    end

    def self.parse_metrics(start_time, end_time, metrics, time_unit)
        case time_unit
        when "minute"
            get_metric_format(start_time, end_time, metrics, time_unit, "%d/%m/%Y %k:%M %p")
        when "hour"
            get_metric_format(start_time, end_time, metrics, time_unit, "%d/%m/%Y %k %p")
        when "day"
            get_metric_format(start_time, end_time, metrics, time_unit, "%d/%m/%Y")
        else
            {}
        end
    end

    def self.format_time(time, string_format, value=0)
        t = Time.parse(time) + value
        time_key = t.strftime(string_format)
    end

    def self.parse_time_value(time, time_unit)
        case time_unit
        when "minute"
        format_time = format_time(time, "%d/%m/%Y %k:%M %p", 60)
        when "hour"
        format_time = format_time(time, "%d/%m/%Y %k %p", 3600)
        when "day"
        format_time = format_time(time, "%d/%m/%Y", 86400)
        else
        time
        end
    end

    def self.parse_hash(start_time, end_time, time_unit)
        hash_count = time_difference(start_time, end_time, time_unit)

        hash = {}
        current_time = start_time

        while hash_count >= 1
            hash[current_time] = 0
            current_time = parse_time_value(current_time, time_unit)
            hash_count = hash_count - 1
        end

        hash
    end

    def self.get_metric_format(start_time, end_time, metrics, time_unit, string_format)
        if metrics.empty?
            {}
        else
            cache = parse_hash(format_time(start_time, string_format), format_time(end_time, string_format), time_unit)

            metrics.each do |metric|
            t = Time.at(metric.created_at)
            time_key = t.strftime(string_format)

            if cache[time_key]
                cache[time_key] += metric.value
            end
            end
            
            cache
        end
    end
end