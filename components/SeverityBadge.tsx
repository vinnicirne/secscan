import React from 'react';
import clsx from 'clsx';

interface SeverityBadgeProps {
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
}

const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity }) => {
  const styles = {
    CRITICAL: "bg-red-100 text-red-700 border-red-200",
    HIGH: "bg-orange-100 text-orange-700 border-orange-200",
    MEDIUM: "bg-yellow-100 text-yellow-700 border-yellow-200",
    LOW: "bg-blue-100 text-blue-700 border-blue-200",
    INFO: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <span className={clsx("px-2 py-0.5 rounded text-xs font-bold border", styles[severity])}>
      {severity}
    </span>
  );
};

export default SeverityBadge;