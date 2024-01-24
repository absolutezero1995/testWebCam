'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();
        await queryInterface.bulkInsert(
            "Categories",
            [
                { title: 'Кино', createdAt: now, updatedAt: now },
                { title: 'История', createdAt: now, updatedAt: now },
                { title: 'Спорт', createdAt: now, updatedAt: now },
                { title: 'Животные', createdAt: now, updatedAt: now },
                { title: 'Космос', createdAt: now, updatedAt: now },
            ],
            {},
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("Categories", null, {});
    },
};
