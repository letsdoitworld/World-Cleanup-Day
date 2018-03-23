
export function searchTrashPointsRequest(query, page, pageSize, location) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve(
                {
                    status: true,
                    trashPoints: [
                        {
                            id: 0,
                            isIncluded: false,
                            status: 'outdated',
                            location: {
                                longitude: 35.0462,
                                latitude: 48.4647,
                            },
                            place: {
                                house: '4',
                                street: 'Sukhumvit Road',
                                city: 'Bangkok'
                            },
                            creator: {
                                name: 'Ihor',
                                lastname: 'Kucherenko',
                                avatar: 'https://rlv.zcache.com/avengers_hulk_smashing_through_bricks_classic_round_sticker-r7b8d8dfc08694373af10c7285f355be6_v9wth_8byvr_540.jpg'
                            },
                            createdAt: '05.01.2018',
                            updater: {
                                name: 'Ihor',
                                lastname: 'Kucherenko',
                                avatar: 'https://rlv.zcache.com/avengers_hulk_smashing_through_bricks_classic_round_sticker-r7b8d8dfc08694373af10c7285f355be6_v9wth_8byvr_540.jpg'
                            },
                            level: 'handful',
                            updatedAt: '05.01.2018',
                            trashTypes: ['Toxic', 'Paper/wood', 'Furniture', 'Domestic waste'],
                            title: "fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd",
                            photos: [
                                'https://i.ytimg.com/vi/1fAs9WPb2sY/hqdefault.jpg',
                                'https://i.ytimg.com/vi/SfLV8hD7zX4/maxresdefault.jpg',
                                'https://media2.s-nbcnews.com/i/newscms/2016_43/1170500/hotdog-taco-dog-today-161029-tease_845d920c7ea63371a9bf48203d22036f.jpg'
                            ]
                        },
                        {
                            id: 1,
                            isIncluded: false,
                            status: 'cleaned',
                            location: {
                                longitude: 35.0460,
                                latitude: 48.4647,
                            },
                            place: {
                                house: '4',
                                street: 'Sukhumvit Road',
                                city: 'Bangkok'
                            },
                            creator: {
                                name: 'Ihor',
                                lastname: 'Kucherenko',
                                avatar: 'https://rlv.zcache.com/avengers_hulk_smashing_through_bricks_classic_round_sticker-r7b8d8dfc08694373af10c7285f355be6_v9wth_8byvr_540.jpg'
                            },
                            createdAt: '05.01.2018',
                            updater: {
                                name: 'Ihor',
                                lastname: 'Kucherenko',
                                avatar: 'https://rlv.zcache.com/avengers_hulk_smashing_through_bricks_classic_round_sticker-r7b8d8dfc08694373af10c7285f355be6_v9wth_8byvr_540.jpg'
                            },
                            level: 'bagful',
                            updatedAt: '05.01.2018',
                            trashTypes: ['Toxic', 'Paper/wood', 'Furniture', 'Domestic waste'],
                            title: "fdfdffd",
                            photos: [
                                'https://i.ytimg.com/vi/1fAs9WPb2sY/hqdefault.jpg',
                                'https://i.ytimg.com/vi/SfLV8hD7zX4/maxresdefault.jpg',
                                'https://media2.s-nbcnews.com/i/newscms/2016_43/1170500/hotdog-taco-dog-today-161029-tease_845d920c7ea63371a9bf48203d22036f.jpg'
                            ]
                        },
                        {
                            id: 2,
                            isIncluded: false,
                            status: 'regular',
                            location: {
                                longitude: 35.0461,
                                latitude: 48.4647,
                            },
                            place: {
                                house: '4',
                                street: 'Sukhumvit Road',
                                city: 'Bangkok'
                            },
                            creator: {
                                name: 'Ihor',
                                lastname: 'Kucherenko',
                                avatar: 'https://rlv.zcache.com/avengers_hulk_smashing_through_bricks_classic_round_sticker-r7b8d8dfc08694373af10c7285f355be6_v9wth_8byvr_540.jpg'
                            },
                            createdAt: '05.01.2018',
                            updater: {
                                name: 'Ihor',
                                lastname: 'Kucherenko',
                                avatar: 'https://rlv.zcache.com/avengers_hulk_smashing_through_bricks_classic_round_sticker-r7b8d8dfc08694373af10c7285f355be6_v9wth_8byvr_540.jpg'
                            },
                            level: 'cartload',
                            updatedAt: '05.01.2018',
                            trashTypes: ['Toxic', 'Paper/wood', 'Furniture', 'Domestic waste'],
                            title: "fdfdffd",
                            photos: [
                                'https://i.ytimg.com/vi/1fAs9WPb2sY/hqdefault.jpg',
                                'https://i.ytimg.com/vi/SfLV8hD7zX4/maxresdefault.jpg',
                                'https://media2.s-nbcnews.com/i/newscms/2016_43/1170500/hotdog-taco-dog-today-161029-tease_845d920c7ea63371a9bf48203d22036f.jpg'
                            ]
                        },
                        {
                            id: 3,
                            isIncluded: false,
                            status: 'urgent',
                            location: {
                                longitude: 35.0464,
                                latitude: 48.4647,
                            },
                            place: {
                                house: '4',
                                street: 'Sukhumvit Road',
                                city: 'Bangkok'
                            },
                            creator: {
                                name: 'Ihor',
                                lastname: 'Kucherenko',
                                avatar: 'https://rlv.zcache.com/avengers_hulk_smashing_through_bricks_classic_round_sticker-r7b8d8dfc08694373af10c7285f355be6_v9wth_8byvr_540.jpg'
                            },
                            createdAt: '05.01.2018',
                            updater: {
                                name: 'Ihor',
                                lastname: 'Kucherenko',
                                avatar: 'https://rlv.zcache.com/avengers_hulk_smashing_through_bricks_classic_round_sticker-r7b8d8dfc08694373af10c7285f355be6_v9wth_8byvr_540.jpg'
                            },
                            updatedAt: '05.01.2018',
                            level: 'truck',
                            trashTypes: ['Toxic', 'Paper/wood', 'Furniture', 'Domestic waste'],
                            title: "fdfdffd",
                            photos: [
                                'https://i.ytimg.com/vi/1fAs9WPb2sY/hqdefault.jpg',
                                'https://i.ytimg.com/vi/SfLV8hD7zX4/maxresdefault.jpg',
                                'https://media2.s-nbcnews.com/i/newscms/2016_43/1170500/hotdog-taco-dog-today-161029-tease_845d920c7ea63371a9bf48203d22036f.jpg'
                            ]
                        },
                        {
                            id: '4',
                            isIncluded: false,
                            status: 'urgent',
                            location: {
                                longitude: 35.0454,
                                latitude: 48.4647,
                            },
                            place: {
                                house: '4',
                                street: 'Sukhumvit Road',
                                city: 'Bangkok'
                            },
                            creator: {
                                name: 'Ihor',
                                lastname: 'Kucherenko',
                                avatar: 'https://rlv.zcache.com/avengers_hulk_smashing_through_bricks_classic_round_sticker-r7b8d8dfc08694373af10c7285f355be6_v9wth_8byvr_540.jpg'
                            },
                            createdAt: '05.01.2018',
                            updater: {
                                name: 'Ihor',
                                lastname: 'Kucherenko',
                                avatar: 'https://rlv.zcache.com/avengers_hulk_smashing_through_bricks_classic_round_sticker-r7b8d8dfc08694373af10c7285f355be6_v9wth_8byvr_540.jpg'
                            },
                            updatedAt: '05.01.2018',
                            level: 'truck',
                            trashTypes: ['Toxic', 'Paper/wood', 'Furniture', 'Domestic waste'],
                            title: "fdfdffd",
                            photos: [
                                'https://i.ytimg.com/vi/1fAs9WPb2sY/hqdefault.jpg',
                                'https://i.ytimg.com/vi/SfLV8hD7zX4/maxresdefault.jpg',
                                'https://media2.s-nbcnews.com/i/newscms/2016_43/1170500/hotdog-taco-dog-today-161029-tease_845d920c7ea63371a9bf48203d22036f.jpg'
                            ]
                        },
                        {
                            id: 5,
                            isIncluded: false,
                            status: 'urgent',
                            location: {
                                longitude: 35.0469,
                                latitude: 48.4647,
                            },
                            place: {
                                house: '4',
                                street: 'Sukhumvit Road',
                                city: 'Bangkok'
                            },
                            creator: {
                                name: 'Ihor',
                                lastname: 'Kucherenko',
                                avatar: 'https://rlv.zcache.com/avengers_hulk_smashing_through_bricks_classic_round_sticker-r7b8d8dfc08694373af10c7285f355be6_v9wth_8byvr_540.jpg'
                            },
                            createdAt: '05.01.2018',
                            updater: {
                                name: 'Ihor',
                                lastname: 'Kucherenko',
                                avatar: 'https://rlv.zcache.com/avengers_hulk_smashing_through_bricks_classic_round_sticker-r7b8d8dfc08694373af10c7285f355be6_v9wth_8byvr_540.jpg'
                            },
                            updatedAt: '05.01.2018',
                            level: 'truck',
                            trashTypes: ['Toxic', 'Paper/wood', 'Furniture', 'Domestic waste'],
                            title: "fdfdffd",
                            photos: [
                                'https://i.ytimg.com/vi/1fAs9WPb2sY/hqdefault.jpg',
                                'https://i.ytimg.com/vi/SfLV8hD7zX4/maxresdefault.jpg',
                                'https://media2.s-nbcnews.com/i/newscms/2016_43/1170500/hotdog-taco-dog-today-161029-tease_845d920c7ea63371a9bf48203d22036f.jpg'
                            ]
                        },
                        {
                            id: 6,
                            isIncluded: false,
                            status: 'urgent',
                            location: {
                                longitude: 35.0454,
                                latitude: 48.4647,
                            },
                            place: {
                                house: '4',
                                street: 'Sukhumvit Road',
                                city: 'Bangkok'
                            },
                            creator: {
                                name: 'Ihor',
                                lastname: 'Kucherenko',
                                avatar: 'https://rlv.zcache.com/avengers_hulk_smashing_through_bricks_classic_round_sticker-r7b8d8dfc08694373af10c7285f355be6_v9wth_8byvr_540.jpg'
                            },
                            createdAt: '05.01.2018',
                            updater: {
                                name: 'Ihor',
                                lastname: 'Kucherenko',
                                avatar: 'https://rlv.zcache.com/avengers_hulk_smashing_through_bricks_classic_round_sticker-r7b8d8dfc08694373af10c7285f355be6_v9wth_8byvr_540.jpg'
                            },
                            updatedAt: '05.01.2018',
                            level: 'truck',
                            trashTypes: ['Toxic', 'Paper/wood', 'Furniture', 'Domestic waste'],
                            title: "fdfdffd",
                            photos: [
                                'https://i.ytimg.com/vi/1fAs9WPb2sY/hqdefault.jpg',
                                'https://i.ytimg.com/vi/SfLV8hD7zX4/maxresdefault.jpg',
                                'https://media2.s-nbcnews.com/i/newscms/2016_43/1170500/hotdog-taco-dog-today-161029-tease_845d920c7ea63371a9bf48203d22036f.jpg'
                            ]
                        },
                        {
                            id: 7,
                            isIncluded: false,
                            status: 'urgent',
                            location: {
                                longitude: 35.0448,
                                latitude: 48.4647,
                            },
                            place: {
                                house: '4',
                                street: 'Sukhumvit Road',
                                city: 'Bangkok'
                            },
                            creator: {
                                name: 'Ihor',
                                lastname: 'Kucherenko',
                                avatar: 'https://rlv.zcache.com/avengers_hulk_smashing_through_bricks_classic_round_sticker-r7b8d8dfc08694373af10c7285f355be6_v9wth_8byvr_540.jpg'
                            },
                            createdAt: '05.01.2018',
                            updater: {
                                name: 'Ihor',
                                lastname: 'Kucherenko',
                                avatar: 'https://rlv.zcache.com/avengers_hulk_smashing_through_bricks_classic_round_sticker-r7b8d8dfc08694373af10c7285f355be6_v9wth_8byvr_540.jpg'
                            },
                            updatedAt: '05.01.2018',
                            level: 'truck',
                            trashTypes: ['Toxic', 'Paper/wood', 'Furniture', 'Domestic waste'],
                            title: "fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd",
                            photos: [
                                'https://i.ytimg.com/vi/1fAs9WPb2sY/hqdefault.jpg',
                                'https://i.ytimg.com/vi/SfLV8hD7zX4/maxresdefault.jpg',
                                'https://media2.s-nbcnews.com/i/newscms/2016_43/1170500/hotdog-taco-dog-today-161029-tease_845d920c7ea63371a9bf48203d22036f.jpg'
                            ]
                        },
                        {
                            id: 8,
                            isIncluded: false,
                            status: 'urgent',
                            location: {
                                longitude: 35.0460,
                                latitude: 48.4645,
                            },
                            place: {
                                house: '4',
                                street: 'Sukhumvit Road',
                                city: 'Bangkok'
                            },
                            creator: {
                                name: 'Ihor',
                                lastname: 'Kucherenko',
                                avatar: 'https://rlv.zcache.com/avengers_hulk_smashing_through_bricks_classic_round_sticker-r7b8d8dfc08694373af10c7285f355be6_v9wth_8byvr_540.jpg'
                            },
                            createdAt: '05.01.2018',
                            updater: {
                                name: 'Ihor',
                                lastname: 'Kucherenko',
                                avatar: 'https://rlv.zcache.com/avengers_hulk_smashing_through_bricks_classic_round_sticker-r7b8d8dfc08694373af10c7285f355be6_v9wth_8byvr_540.jpg'
                            },
                            updatedAt: '05.01.2018',
                            level: 'truck',
                            trashTypes: ['Toxic', 'Paper/wood', 'Furniture', 'Domestic waste'],
                            title: "fdfdffd",
                            photos: [
                                'https://i.ytimg.com/vi/1fAs9WPb2sY/hqdefault.jpg',
                                'https://i.ytimg.com/vi/SfLV8hD7zX4/maxresdefault.jpg',
                                'https://media2.s-nbcnews.com/i/newscms/2016_43/1170500/hotdog-taco-dog-today-161029-tease_845d920c7ea63371a9bf48203d22036f.jpg'
                            ]
                        },
                        {
                            id: 9,
                            isIncluded: false,
                            status: 'urgent',
                            location: {
                                longitude: 35.0460,
                                latitude: 48.4643,
                            },
                            place: {
                                house: '4',
                                street: 'Sukhumvit Road',
                                city: 'Bangkok'
                            },
                            creator: {
                                name: 'Ihor',
                                lastname: 'Kucherenko',
                                avatar: 'https://rlv.zcache.com/avengers_hulk_smashing_through_bricks_classic_round_sticker-r7b8d8dfc08694373af10c7285f355be6_v9wth_8byvr_540.jpg'
                            },
                            createdAt: '05.01.2018',
                            updater: {
                                name: 'Ihor',
                                lastname: 'Kucherenko',
                                avatar: 'https://rlv.zcache.com/avengers_hulk_smashing_through_bricks_classic_round_sticker-r7b8d8dfc08694373af10c7285f355be6_v9wth_8byvr_540.jpg'
                            },
                            updatedAt: '05.01.2018',
                            level: 'truck',
                            trashTypes: ['Toxic', 'Paper/wood', 'Furniture', 'Domestic waste'],
                            title: "fdfdffd",
                            photos: [
                                'https://i.ytimg.com/vi/1fAs9WPb2sY/hqdefault.jpg',
                                'https://i.ytimg.com/vi/SfLV8hD7zX4/maxresdefault.jpg',
                                'https://media2.s-nbcnews.com/i/newscms/2016_43/1170500/hotdog-taco-dog-today-161029-tease_845d920c7ea63371a9bf48203d22036f.jpg'
                            ]
                        },
                        {
                            id: 10,
                            isIncluded: false,
                            status: 'urgent',
                            location: {
                                longitude: 35.0460,
                                latitude: 48.4649,
                            },
                            place: {
                                house: '4',
                                street: 'Sukhumvit Road',
                                city: 'Bangkok'
                            },
                            creator: {
                                name: 'Ihor',
                                lastname: 'Kucherenko',
                                avatar: 'https://rlv.zcache.com/avengers_hulk_smashing_through_bricks_classic_round_sticker-r7b8d8dfc08694373af10c7285f355be6_v9wth_8byvr_540.jpg'
                            },
                            createdAt: '05.01.2018',
                            updater: {
                                name: 'Ihor',
                                lastname: 'Kucherenko',
                                avatar: 'https://rlv.zcache.com/avengers_hulk_smashing_through_bricks_classic_round_sticker-r7b8d8dfc08694373af10c7285f355be6_v9wth_8byvr_540.jpg'
                            },
                            updatedAt: '05.01.2018',
                            level: 'truck',
                            trashTypes: ['Toxic', 'Paper/wood', 'Furniture', 'Domestic waste'],
                            title: "fdfdffd",
                            photos: [
                                'https://i.ytimg.com/vi/1fAs9WPb2sY/hqdefault.jpg',
                                'https://i.ytimg.com/vi/SfLV8hD7zX4/maxresdefault.jpg',
                                'https://media2.s-nbcnews.com/i/newscms/2016_43/1170500/hotdog-taco-dog-today-161029-tease_845d920c7ea63371a9bf48203d22036f.jpg'
                            ]
                        },
                        {
                            id: 11,
                            isIncluded: false,
                            status: 'urgent',
                            location: {
                                longitude: 35.0460,
                                latitude: 48.4646,
                            },
                            place: {
                                house: '4',
                                street: 'Sukhumvit Road',
                                city: 'Bangkok'
                            },
                            creator: {
                                name: 'Ihor',
                                lastname: 'Kucherenko',
                                avatar: 'https://rlv.zcache.com/avengers_hulk_smashing_through_bricks_classic_round_sticker-r7b8d8dfc08694373af10c7285f355be6_v9wth_8byvr_540.jpg'
                            },
                            createdAt: '05.01.2018',
                            updater: {
                                name: 'Ihor',
                                lastname: 'Kucherenko',
                                avatar: 'https://rlv.zcache.com/avengers_hulk_smashing_through_bricks_classic_round_sticker-r7b8d8dfc08694373af10c7285f355be6_v9wth_8byvr_540.jpg'
                            },
                            updatedAt: '05.01.2018',
                            level: 'truck',
                            trashTypes: ['Toxic', 'Paper/wood', 'Furniture', 'Domestic waste'],
                            title: "fdfdffd",
                            photos: [
                                'https://i.ytimg.com/vi/1fAs9WPb2sY/hqdefault.jpg',
                                'https://i.ytimg.com/vi/SfLV8hD7zX4/maxresdefault.jpg',
                                'https://media2.s-nbcnews.com/i/newscms/2016_43/1170500/hotdog-taco-dog-today-161029-tease_845d920c7ea63371a9bf48203d22036f.jpg'
                            ]
                        },
                        {
                            id: 12,
                            isIncluded: false,
                            status: 'urgent',
                            location: {
                                longitude: 35.0460,
                                latitude: 48.4648,
                            },
                            place: {
                                house: '4',
                                street: 'Sukhumvit Road',
                                city: 'Bangkok'
                            },
                            creator: {
                                name: 'Ihor',
                                lastname: 'Kucherenko',
                                avatar: 'https://rlv.zcache.com/avengers_hulk_smashing_through_bricks_classic_round_sticker-r7b8d8dfc08694373af10c7285f355be6_v9wth_8byvr_540.jpg'
                            },
                            createdAt: '05.01.2018',
                            updater: {
                                name: 'Ihor',
                                lastname: 'Kucherenko',
                                avatar: 'https://rlv.zcache.com/avengers_hulk_smashing_through_bricks_classic_round_sticker-r7b8d8dfc08694373af10c7285f355be6_v9wth_8byvr_540.jpg'
                            },
                            updatedAt: '05.01.2018',
                            level: 'truck',
                            trashTypes: ['Toxic', 'Paper/wood', 'Furniture', 'Domestic waste'],
                            title: "fdfdffd",
                            photos: [
                                'https://i.ytimg.com/vi/1fAs9WPb2sY/hqdefault.jpg',
                                'https://i.ytimg.com/vi/SfLV8hD7zX4/maxresdefault.jpg',
                                'https://media2.s-nbcnews.com/i/newscms/2016_43/1170500/hotdog-taco-dog-today-161029-tease_845d920c7ea63371a9bf48203d22036f.jpg'
                            ]
                        },
                        {
                            id: 13,
                            isIncluded: false,
                            status: 'urgent',
                            location: {
                                longitude: 35.0460,
                                latitude: 48.4644,
                            },
                            place: {
                                house: '4',
                                street: 'Sukhumvit Road',
                                city: 'Bangkok'
                            },
                            creator: {
                                name: 'Ihor',
                                lastname: 'Kucherenko',
                                avatar: 'https://rlv.zcache.com/avengers_hulk_smashing_through_bricks_classic_round_sticker-r7b8d8dfc08694373af10c7285f355be6_v9wth_8byvr_540.jpg'
                            },
                            createdAt: '05.01.2018',
                            updater: {
                                name: 'Ihor',
                                lastname: 'Kucherenko',
                                avatar: 'https://rlv.zcache.com/avengers_hulk_smashing_through_bricks_classic_round_sticker-r7b8d8dfc08694373af10c7285f355be6_v9wth_8byvr_540.jpg'
                            },
                            updatedAt: '05.01.2018',
                            level: 'truck',
                            trashTypes: ['Toxic', 'Paper/wood', 'Furniture', 'Domestic waste'],
                            title: "fdfdffd",
                            photos: [
                                'https://i.ytimg.com/vi/1fAs9WPb2sY/hqdefault.jpg',
                                'https://i.ytimg.com/vi/SfLV8hD7zX4/maxresdefault.jpg',
                                'https://media2.s-nbcnews.com/i/newscms/2016_43/1170500/hotdog-taco-dog-today-161029-tease_845d920c7ea63371a9bf48203d22036f.jpg'
                            ]
                        },
                        {
                            id: 14,
                            isIncluded: false,
                            status: 'urgent',
                            location: {
                                longitude: 35.0451,
                                latitude: 48.4647,
                            },
                            place: {
                                house: '4',
                                street: 'Sukhumvit Road',
                                city: 'Bangkok'
                            },
                            creator: {
                                name: 'Ihor',
                                lastname: 'Kucherenko',
                                avatar: 'https://rlv.zcache.com/avengers_hulk_smashing_through_bricks_classic_round_sticker-r7b8d8dfc08694373af10c7285f355be6_v9wth_8byvr_540.jpg'
                            },
                            createdAt: '05.01.2018',
                            updater: {
                                name: 'Ihor',
                                lastname: 'Kucherenko',
                                avatar: 'https://rlv.zcache.com/avengers_hulk_smashing_through_bricks_classic_round_sticker-r7b8d8dfc08694373af10c7285f355be6_v9wth_8byvr_540.jpg'
                            },
                            updatedAt: '05.01.2018',
                            level: 'truck',
                            trashTypes: ['Toxic', 'Paper/wood', 'Furniture', 'Domestic waste'],
                            title: "fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd",
                            photos: [
                                'https://i.ytimg.com/vi/1fAs9WPb2sY/hqdefault.jpg',
                                'https://i.ytimg.com/vi/SfLV8hD7zX4/maxresdefault.jpg',
                                'https://media2.s-nbcnews.com/i/newscms/2016_43/1170500/hotdog-taco-dog-today-161029-tease_845d920c7ea63371a9bf48203d22036f.jpg'
                            ]
                        },
                        {
                            id: 15,
                            isIncluded: false,
                            status: 'urgent',
                            location: {
                                longitude: 35.0461,
                                latitude: 48.4645,
                            },
                            place: {
                                house: '4',
                                street: 'Sukhumvit Road',
                                city: 'Bangkok'
                            },
                            creator: {
                                name: 'Ihor',
                                lastname: 'Kucherenko',
                                avatar: 'https://rlv.zcache.com/avengers_hulk_smashing_through_bricks_classic_round_sticker-r7b8d8dfc08694373af10c7285f355be6_v9wth_8byvr_540.jpg'
                            },
                            createdAt: '05.01.2018',
                            updater: {
                                name: 'Ihor',
                                lastname: 'Kucherenko',
                                avatar: 'https://rlv.zcache.com/avengers_hulk_smashing_through_bricks_classic_round_sticker-r7b8d8dfc08694373af10c7285f355be6_v9wth_8byvr_540.jpg'
                            },
                            updatedAt: '05.01.2018',
                            level: 'truck',
                            trashTypes: ['Toxic', 'Paper/wood', 'Furniture', 'Domestic waste'],
                            title: "fdfdffd",
                            photos: [
                                'https://i.ytimg.com/vi/1fAs9WPb2sY/hqdefault.jpg',
                                'https://i.ytimg.com/vi/SfLV8hD7zX4/maxresdefault.jpg',
                                'https://media2.s-nbcnews.com/i/newscms/2016_43/1170500/hotdog-taco-dog-today-161029-tease_845d920c7ea63371a9bf48203d22036f.jpg'
                            ]
                        },
                        {
                            id: 16,
                            isIncluded: true,
                            status: 'urgent',
                            location: {
                                longitude: 35.0462,
                                latitude: 48.4646,
                            },
                            place: {
                                house: '4',
                                street: 'Sukhumvit Road',
                                city: 'Bangkok'
                            },
                            creator: {
                                name: 'Ihor',
                                lastname: 'Kucherenko',
                                avatar: 'https://rlv.zcache.com/avengers_hulk_smashing_through_bricks_classic_round_sticker-r7b8d8dfc08694373af10c7285f355be6_v9wth_8byvr_540.jpg'
                            },
                            createdAt: '05.01.2018',
                            updater: {
                                name: 'Ihor',
                                lastname: 'Kucherenko',
                                avatar: 'https://rlv.zcache.com/avengers_hulk_smashing_through_bricks_classic_round_sticker-r7b8d8dfc08694373af10c7285f355be6_v9wth_8byvr_540.jpg'
                            },
                            updatedAt: '05.01.2018',
                            level: 'truck',
                            trashTypes: ['Toxic', 'Paper/wood', 'Furniture', 'Domestic waste'],
                            title: "fdfdffd",
                            photos: [
                                'https://i.ytimg.com/vi/1fAs9WPb2sY/hqdefault.jpg',
                                'https://i.ytimg.com/vi/SfLV8hD7zX4/maxresdefault.jpg',
                                'https://media2.s-nbcnews.com/i/newscms/2016_43/1170500/hotdog-taco-dog-today-161029-tease_845d920c7ea63371a9bf48203d22036f.jpg'
                            ]
                        },
                        {
                            id: 17,
                            isIncluded: true,
                            status: 'urgent',
                            location: {
                                longitude: 35.0461,
                                latitude: 48.4649,
                            },
                            place: {
                                house: '4',
                                street: 'Sukhumvit Road',
                                city: 'Bangkok'
                            },
                            creator: {
                                name: 'Ihor',
                                lastname: 'Kucherenko',
                                avatar: 'https://rlv.zcache.com/avengers_hulk_smashing_through_bricks_classic_round_sticker-r7b8d8dfc08694373af10c7285f355be6_v9wth_8byvr_540.jpg'
                            },
                            createdAt: '05.01.2018',
                            updater: {
                                name: 'Ihor',
                                lastname: 'Kucherenko',
                                avatar: 'https://rlv.zcache.com/avengers_hulk_smashing_through_bricks_classic_round_sticker-r7b8d8dfc08694373af10c7285f355be6_v9wth_8byvr_540.jpg'
                            },
                            updatedAt: '05.01.2018',
                            level: 'truck',
                            trashTypes: ['Toxic', 'Paper/wood', 'Furniture', 'Domestic waste'],
                            title: "fdfdffd",
                            photos: [
                                'https://i.ytimg.com/vi/1fAs9WPb2sY/hqdefault.jpg',
                                'https://i.ytimg.com/vi/SfLV8hD7zX4/maxresdefault.jpg',
                                'https://media2.s-nbcnews.com/i/newscms/2016_43/1170500/hotdog-taco-dog-today-161029-tease_845d920c7ea63371a9bf48203d22036f.jpg'
                            ]
                        },
                        {
                            id: 18,
                            isIncluded: true,
                            status: 'urgent',
                            location: {
                                longitude: 35.0465,
                                latitude: 48.4646,
                            },
                            place: {
                                house: '4',
                                street: 'Sukhumvit Road',
                                city: 'Bangkok'
                            },
                            creator: {
                                name: 'Ihor',
                                lastname: 'Kucherenko',
                                avatar: 'https://rlv.zcache.com/avengers_hulk_smashing_through_bricks_classic_round_sticker-r7b8d8dfc08694373af10c7285f355be6_v9wth_8byvr_540.jpg'
                            },
                            createdAt: '05.01.2018',
                            updater: {
                                name: 'Ihor',
                                lastname: 'Kucherenko',
                                avatar: 'https://rlv.zcache.com/avengers_hulk_smashing_through_bricks_classic_round_sticker-r7b8d8dfc08694373af10c7285f355be6_v9wth_8byvr_540.jpg'
                            },
                            updatedAt: '05.01.2018',
                            level: 'truck',
                            trashTypes: ['Toxic', 'Paper/wood', 'Furniture', 'Domestic waste'],
                            title: "fdfdffd",
                            photos: [
                                'https://i.ytimg.com/vi/1fAs9WPb2sY/hqdefault.jpg',
                                'https://i.ytimg.com/vi/SfLV8hD7zX4/maxresdefault.jpg',
                                'https://media2.s-nbcnews.com/i/newscms/2016_43/1170500/hotdog-taco-dog-today-161029-tease_845d920c7ea63371a9bf48203d22036f.jpg'
                            ]
                        },
                        {
                            id: 19,
                            isIncluded: true,
                            status: 'urgent',
                            location: {
                                longitude: 35.0461,
                                latitude: 48.4646,
                            },
                            place: {
                                house: '4',
                                street: 'Sukhumvit Road',
                                city: 'Bangkok'
                            },
                            creator: {
                                name: 'Ihor',
                                lastname: 'Kucherenko',
                                avatar: 'https://rlv.zcache.com/avengers_hulk_smashing_through_bricks_classic_round_sticker-r7b8d8dfc08694373af10c7285f355be6_v9wth_8byvr_540.jpg'
                            },
                            createdAt: '05.01.2018',
                            updater: {
                                name: 'Ihor',
                                lastname: 'Kucherenko',
                                avatar: 'https://rlv.zcache.com/avengers_hulk_smashing_through_bricks_classic_round_sticker-r7b8d8dfc08694373af10c7285f355be6_v9wth_8byvr_540.jpg'
                            },
                            updatedAt: '05.01.2018',
                            level: 'truck',
                            trashTypes: ['Toxic', 'Paper/wood', 'Furniture', 'Domestic waste'],
                            title: "fdfdffd",
                            photos: [
                                'https://i.ytimg.com/vi/1fAs9WPb2sY/hqdefault.jpg',
                                'https://i.ytimg.com/vi/SfLV8hD7zX4/maxresdefault.jpg',
                                'https://media2.s-nbcnews.com/i/newscms/2016_43/1170500/hotdog-taco-dog-today-161029-tease_845d920c7ea63371a9bf48203d22036f.jpg'
                            ]
                        },
                        {
                            id: 20,
                            isIncluded: false,
                            status: 'urgent',
                            location: {
                                longitude: 35.0457,
                                latitude: 48.4657,
                            },
                            place: {
                                house: '4',
                                street: 'Sukhumvit Road',
                                city: 'Bangkok'
                            },
                            creator: {
                                name: 'Ihor',
                                lastname: 'Kucherenko',
                                avatar: 'https://rlv.zcache.com/avengers_hulk_smashing_through_bricks_classic_round_sticker-r7b8d8dfc08694373af10c7285f355be6_v9wth_8byvr_540.jpg'
                            },
                            createdAt: '05.01.2018',
                            updater: {
                                name: 'Ihor',
                                lastname: 'Kucherenko',
                                avatar: 'https://rlv.zcache.com/avengers_hulk_smashing_through_bricks_classic_round_sticker-r7b8d8dfc08694373af10c7285f355be6_v9wth_8byvr_540.jpg'
                            },
                            updatedAt: '05.01.2018',
                            level: 'truck',
                            trashTypes: ['Toxic', 'Paper/wood', 'Furniture', 'Domestic waste'],
                            title: "fdfdffd",
                            photos: [
                                'https://i.ytimg.com/vi/1fAs9WPb2sY/hqdefault.jpg',
                                'https://i.ytimg.com/vi/SfLV8hD7zX4/maxresdefault.jpg',
                                'https://media2.s-nbcnews.com/i/newscms/2016_43/1170500/hotdog-taco-dog-today-161029-tease_845d920c7ea63371a9bf48203d22036f.jpg'
                            ]
                        }
                    ]
                        .filter((trashPoint) => query === undefined || query === null || trashPoint.title.startsWith(query))
                        .slice(page * pageSize, page * pageSize + pageSize)
                }
            );
        }, 3000)
    }).then((response) => {
        return response
    }).catch((error) => {
        console.log(error)
    })
}

export default {
    searchTrashPointsRequest
}