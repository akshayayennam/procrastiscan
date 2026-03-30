import { cn } from '../../lib/utils';

export default function SummaryCard({ title, value, icon: Icon, trend, trendValue, colorClass }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className={cn('p-3 rounded-xl', colorClass)}>
          {/* eslint-disable-next-line no-unused-vars */}
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {(trend || trendValue) && (
        <div className="mt-4 flex items-center gap-2">
          <span className={cn(
            'text-xs font-semibold px-2 py-1 rounded-full',
            trend === 'up' ? 'text-green-700 bg-green-50' : trend === 'down' ? 'text-red-700 bg-red-50' : 'text-gray-700 bg-gray-50'
          )}>
            {trend === 'up' && '↑ '}
            {trend === 'down' && '↓ '}
            {trendValue}
          </span>
          <span className="text-xs text-gray-400">vs last week</span>
        </div>
      )}
    </div>
  );
}
