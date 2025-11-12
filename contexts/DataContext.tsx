import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { HoldingData } from '../types';
import { holdingData as initialData } from '../constants/data';
import * as Icons from '../components/Icons';

// Helper to map string names back to icon components
const iconMap: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
    BuildingIcon: Icons.BuildingIcon,
    RocketIcon: Icons.RocketIcon,
    ShieldCheckIcon: Icons.ShieldCheckIcon,
    UsersIcon: Icons.UsersIcon,
    LightBulbIcon: Icons.LightBulbIcon,
    HeartIcon: Icons.HeartIcon,
    BarChartIcon: Icons.BarChartIcon,
    DiamondIcon: Icons.DiamondIcon,
    FeatherIcon: Icons.FeatherIcon,
    EyeIcon: Icons.EyeIcon,
    TargetIcon: Icons.TargetIcon,
    StarIcon: Icons.StarIcon,
};

// This function restores the component references after loading from JSON
const hydrateIcons = (data: any): HoldingData => {
    if (!data) return data;
    return {
        ...data,
        values: {
            ...data.values,
            items: data.values.items.map((item: any) => ({
                ...item,
                icon: iconMap[item.icon] || Icons.StarIcon,
            })),
        },
        subsidiaries: data.subsidiaries.map((company: any) => ({
            ...company,
            services: company.services.map((service: any) => ({
                ...service,
                icon: iconMap[service.icon] || Icons.StarIcon,
            })),
            competitiveAdvantages: company.competitiveAdvantages.map((advantage: any) => ({
                ...advantage,
                icon: iconMap[advantage.icon] || Icons.StarIcon,
            })),
            assets: company.assets.map((asset: any) => ({
                ...asset,
                icon: iconMap[asset.icon] || Icons.StarIcon,
            })),
        })),
    };
};

// This function prepares data for storage/API by replacing components with names
const dehydrateIcons = (data: HoldingData) => {
    const getIconName = (icon: React.FC<React.SVGProps<SVGSVGElement>>) => {
        return (Object.keys(iconMap) as Array<keyof typeof iconMap>).find(key => iconMap[key] === icon) || 'StarIcon';
    };
    // Use JSON.parse(JSON.stringify()) for a deep copy to avoid mutating the state directly
    const dehydrated = JSON.parse(JSON.stringify({
        ...data,
        values: {
            ...data.values,
            items: data.values.items.map(item => ({...item, icon: getIconName(item.icon) })),
        },
        subsidiaries: data.subsidiaries.map(company => ({
            ...company,
            services: company.services.map(service => ({ ...service, icon: getIconName(service.icon) })),
            competitiveAdvantages: company.competitiveAdvantages.map(advantage => ({ ...advantage, icon: getIconName(advantage.icon) })),
            assets: company.assets.map(asset => ({ ...asset, icon: getIconName(asset.icon) })),
        }))
    }));
    return dehydrated;
}


interface DataContextType {
    holdingData: HoldingData;
    updateHoldingData: (newData: HoldingData) => Promise<void>;
    isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [holdingData, setHoldingData] = useState<HoldingData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        try {
            const localData = localStorage.getItem('holdingData');
            if (localData) {
                console.log("Loading data from localStorage.");
                setHoldingData(hydrateIcons(JSON.parse(localData)));
            } else {
                console.log("localStorage is empty. Loading from initial constants and populating storage.");
                 // Dehydrate to store icon names, not component objects
                const dataToStore = dehydrateIcons(initialData);
                localStorage.setItem('holdingData', JSON.stringify(dataToStore));
                setHoldingData(initialData); // Use the original hydrated data for the state
            }
        } catch (error) {
            console.error("Failed to load data, falling back to initial data.", error);
            setHoldingData(initialData);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateHoldingData = async (newData: HoldingData) => {
        const dataToStore = dehydrateIcons(newData);
        try {
            localStorage.setItem('holdingData', JSON.stringify(dataToStore));
            setHoldingData(newData);
            alert('اطلاعات با موفقیت در حافظه مرورگر ذخیره شد.');
        } catch (error) {
            console.error("Failed to save to localStorage.", error);
            alert('خطایی در ذخیره‌سازی اطلاعات رخ داد.');
        }
    };
    
    if (isLoading || !holdingData) {
        return <div>در حال بارگذاری اطلاعات...</div>;
    }

    return (
        <DataContext.Provider value={{ holdingData: holdingData!, updateHoldingData, isLoading }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = (): DataContextType => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};