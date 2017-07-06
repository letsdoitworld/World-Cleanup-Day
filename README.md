# Let's Do It: World Cleanup Day! ♻️

Over 17M trash heroes have cleaned up more than 500 000 tonnes of trash in 100+ countries! 😃 

We are now building a World Cleanup mapping app and platform to scale up the movement and inspire the next 100s of Millions to join the World Cleanup Day on **15th of September 2018**.

Getting rid of trash once and for all will save lives, improve health & reduce costs. Let's do it!

![World Cleanup Day](https://www.letsdoitworld.org/wp-content/uploads/2017/04/header.png)
![World Cleanup Day](https://www.letsdoitworld.org/wp-content/uploads/2017/04/content.png)

## Watch the App video

<a href="https://www.youtube.com/watch?feature=player_embedded&v=YnPvOVzbQpA
" target="_blank"><img src="https://s3.eu-central-1.amazonaws.com/lets-do-it-world/world-cleanup-day-app-video.png" 
alt="Let's Do It: World Cleanup Day!" width="100%" border="0" /></a>

## Download World Cleanup App

Apple App Store:
[World Cleanup for iOS](https://itunes.apple.com/us/app/world-cleanup/id1237553057)

Google Play
[World Cleanup for Android](https://play.google.com/store/apps/details?id=com.teeme.ldi)

## Find how you can contribute 🔨
Thank you for considering contributing to World Cleanup Day Mobile App! See the [CONTRIBUTING.md](https://github.com/letsdoitworld/World-Cleanup-Day/blob/master/CONTRIBUTING.md)

## Roadmap 🗺️
This is a high-level roadmap for the next 6 months. For more details, please <a href="mailto:kristiina@letsdoitworld.org">request access to</a> the World Cleanup Day Asana.

### Phase 1:
- [ ] User profile. User must authenticate through Facebook or Google. Email address will be validated upon signing up.
- [ ] Type of users/roles. 
  - [ ] Master Admin/World Wide User Admin
  - [ ] Area Admin
  - [ ] Volunteer
  - [ ] Waste management and sanitation operators
  - [ ] Pile CRUD. Details about a pile fields, statuses and CRUD actions
  - [ ] Fields
  - [ ] Actions
  - [ ] Status

- [ ] Pile Comments
  - [ ] Any admin area can comment a pile added by any volunteer in his area. 
  - [ ] Comments can be deleted only by volunteer who added it or the admin area.

- [ ] View piles
  - [ ] In mobile: [my trash points](https://preview.uxpin.com/001ea6feee9ab2ec6731db74ccbc587f46cde1e3#/pages/65373808/simulate/sitemap)

Any user can view **on the web**  piles by selecting a layer or multiple options/filters in a new layer:

Important ones shown by two layers (template):
- [ ] I want to map:
  - [ ] by status pending (just inserted by users)
  - [ ] by status reported (if we have a protocol to report piles to local authorities for cleanup)
  - [ ] by user (filter piles inserted or allocated by the user)
  - [ ] by status confirmed (if we validated the pile - validation protocol)
  - [ ] by status unconfirmed (if we need and extra validation protocol)
  
- [ ] I want to clean
  - [ ] by status cleaned
  - [ ] by status allocated (fully allocated or partial allocated)
  - [ ] by status unallocated
  - [ ] by user (filter piles inserted or allocated by the user)
  - [ ] by team (filter piles inserted or allocated by team the user is member of)
  
- [ ] Optional ones(by selecting from advanced submenu you can choose different filters):.
  - [ ] Layer for sanitations operators to see the GPS location of the bags left by volunteers
  - [ ] Heat map layer
  - [ ] By date (last week, last month, custom range)
  
Each user will see by defaul all piles from the country where he is located by GPS, but if he want to see all piles from the world he will have this option (optimization for maps api calls)

- [ ] Help, Terms& conditions, Privacy, Contact us
- [ ] Feedback, warnings and errors

Every time when user will click Save, the user will receive feedback on the record, if the record was saved or was error, if there is no connection to the internet or GPS.
- [ ] Feedback
- [ ] Warnings
- [ ] Errors

### Phase 2:
- [ ] Reports
- [ ] Dashboard screen
- [ ] Type of user - Waste management and sanitation operators
- [ ] Pile PDF Export
- [ ] Notifications

### Phase 3:
- [ ] Team Cleanup management
- [ ] Predefined data

## Install steps ⚙️

* The `backend-` and `module-` directories need `yarn install` under each of them.
* The `module-` directories need `yarn link` under each of them.
* The `backend-` directories need to `yarn link module-name` to each of the modules.
* Then you can issue `docker-compose up -d` from under `devops/backend`.

## Contact :mailbox:
Join the movement and let's clean up the World together!

* Facebook: https://www.facebook.com/letsdoitworld
* Twitter: https://twitter.com/letsdoitworld
* Instagram: https://www.instagram.com/letsdoitworld/
* YouTube: https://www.youtube.com/letsdoitworld
* Flickr: https://www.flickr.com/letsdoitworld/
* Wikipedia: https://en.wikipedia.org/wiki/Let%27s_Do_It!_World
* Homepage: https://www.letsdoitworld.org/

## License

[GPL-3.0 license](https://opensource.org/licenses/GPL-3.0)


