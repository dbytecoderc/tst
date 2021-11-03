module Api
  module V1 
    class MetricsController < ApplicationController
      def index
        begin
          start_time = params.require(:start_time)
          end_time = params.require(:end_time)
          time_unit = params.require(:time_unit)
          
          metrics = Metric.order('created_at ASC').where('created_at BETWEEN ? AND ?', start_time, end_time)
          ticket_metrics = Utilities.parse_metrics(start_time, end_time, metrics, time_unit)
  
          hash_count = Utilities.time_difference(start_time, end_time, time_unit)
          sum = metrics.sum(:value)
  
          average = sum / hash_count.to_f
  
          render json: { 
            "ticket_metrics": ticket_metrics,
            "average": average
          }
        rescue Exception => e
          raise e
        end
      end

      def create
        timestamp = params.require(:timestamp)
        name = params.require(:name)
        value = params.require(:value)
        time_unit = params.require(:time_unit)

        metric = Metric.new({
          created_at: timestamp,
          name: name,
          value: value
        })

        if metric.save
          render json: {
            "id": metric.id,
            "timestamp": Utilities.parse_time_value(timestamp, time_unit),
            "value": metric.value,
            "name": metric.name
          }, status: :created
        else
          render json: metric.errors, status: :unprocessable_entity
        end
      end
    end
  end
end
