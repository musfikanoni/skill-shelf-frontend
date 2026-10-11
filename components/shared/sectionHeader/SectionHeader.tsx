// components/common/SectionHeader.tsx

import React from "react";

interface SectionHeaderProps {
    badge?: string;
    title: string;
    description?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
    badge = "",
    title,
    description,
}) => {
    return (
        <div className="text-center mb-10">
            {badge && (
                <span className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 text-xs font-semibold tracking-wider uppercase px-4 py-1.5 rounded-full mb-4">
                    {badge}
                </span>
            )}

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {title}
            </h2>

            {description && (
                <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
                    {description}
                </p>
            )}
        </div>
    );
};

export default SectionHeader;