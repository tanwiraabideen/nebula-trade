import { getUserValue } from "../actions/actions";

export async function addUserValues(users) {
    const updatedUsers = await Promise.all(users.map(async (user) => {
        const userValue = await getUserValue(user.id);
        return { ...user, userValue };
    }));

    return updatedUsers;
}

export async function orderUsers(users) {
    const newUsers = await addUserValues(users)
    newUsers.sort((a, b) => b.userValue - a.userValue)
    console.log('NEW USER IS', newUsers)
    return newUsers
}

export function getLevel(value) {
    try {
        const levels = [{
            name: "Bronze",
            valueRequired: 0,
            icon: '/gems/bronze.svg'
        }, {
            name: "Silver",
            valueRequired: 1500,
            icon: '/gems/silver.svg'
        }, {
            name: "Gold",
            valueRequired: 2500,
            icon: '/gems/gold.svg'
        }, {
            name: "Diamond",
            valueRequired: 5000,
            icon: '/gems/diamond.svg'
        }, {
            name: "Crystal",
            valueRequired: 7500,
            icon: '/gems/crystal.svg'
        }, {
            name: "Peridot",
            valueRequired: 10000,
            icon: '/gems/peridot.svg'
        }, {
            name: "Ruby",
            valueRequired: 15000,
            icon: '/gems/ruby.svg'
        }, {
            name: "Rose Quartz",
            valueRequired: 25000,
            icon: '/gems/roseQuartz.svg'
        }, {
            name: "Fire Opal",
            valueRequired: 50000,
            icon: '/gems/fireOpal.svg'
        }]

        if (value >= levels[levels.length - 1].valueRequired) {
            return {
                level: levels[levels.length - 1],
                percentage: 100
            };
        }

        for (let i = 0; i < levels.length; i++) {
            if (levels[i].valueRequired > value) {
                const previousLevel = levels[i - 1];
                const currentLevel = levels[i];
                const percentage = ((value - previousLevel.valueRequired) / (currentLevel.valueRequired - previousLevel.valueRequired)) * 100;
                return {
                    currentLevel: previousLevel,
                    nextLevel: currentLevel,
                    percentage: Math.min(Math.max(percentage, 0), 100)
                };
            }
        }

        return { level: levels[0], percentage: 0 };
    } catch (error) {
        console.error("Error in getLevel function:", error);
        throw error;
    }
}