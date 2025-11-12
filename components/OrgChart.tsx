import React from 'react';
import type { Department } from '../types';
import { UsersIcon } from './Icons';

interface OrgChartNodeProps {
  department: Department;
  children: OrgChartNodeProps[];
  level: number;
}

const DepartmentNode: React.FC<{ department: Department }> = ({ department }) => (
    <div className="relative group">
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-[#00bfa6] flex flex-col items-center text-center min-w-[160px]">
            <UsersIcon className="w-8 h-8 text-gray-400 mb-2" />
            <h4 className="font-bold text-lg text-[#555555]">{department.name}</h4>
            <p className="text-sm text-gray-500">{department.manager}</p>
        </div>
        {department.description && (
            <div className="absolute bottom-full mb-2 w-56 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 z-10 text-right leading-relaxed">
                <h5 className="font-bold mb-1 border-b border-gray-600 pb-1">شرح وظایف</h5>
                <p className="text-gray-200">{department.description}</p>
            </div>
        )}
    </div>
);


const TreeNode: React.FC<{ node: OrgChartNodeProps }> = ({ node }) => {
    return (
        <li className="relative flex flex-col items-center px-4">
            <DepartmentNode department={node.department} />
            {node.children.length > 0 && (
                <ul className="flex justify-center gap-8 pt-12 relative before:content-[''] before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:w-px before:h-12 before:bg-gray-300">
                    {node.children.map(childNode => (
                         <li key={childNode.department.id} className="relative before:content-[''] before:absolute before:bottom-full before:left-1/2 before:-translate-x-1/2 before:w-px before:h-12 before:bg-gray-300 after:content-[''] after:absolute after:bottom-full after:left-0 after:w-full after:h-px after:bg-gray-300">
                            <TreeNode node={childNode} />
                        </li>
                    ))}
                </ul>
            )}
        </li>
    );
};

const OrgChart: React.FC<{ departments: Department[] }> = ({ departments }) => {
    if (!departments || departments.length === 0) {
        return null;
    }

    const buildTree = (list: Department[]): OrgChartNodeProps[] => {
        const map: { [key: string]: OrgChartNodeProps } = {};
        list.forEach(dept => {
            map[dept.id] = { department: dept, children: [], level: 0 };
        });

        const tree: OrgChartNodeProps[] = [];
        list.forEach(dept => {
            if (dept.parentId && map[dept.parentId]) {
                map[dept.parentId].children.push(map[dept.id]);
                map[dept.id].level = map[dept.parentId].level + 1;
            } else {
                tree.push(map[dept.id]);
            }
        });
        return tree;
    };

    const treeData = buildTree(departments);

    return (
        <div className="overflow-x-auto pb-8">
           <ul className="inline-flex">
               {treeData.map(rootNode => (
                    <TreeNode key={rootNode.department.id} node={rootNode} />
                ))}
           </ul>
        </div>
    );
};

export default OrgChart;