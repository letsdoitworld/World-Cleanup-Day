'use strict';
const {E, LuciusError, Lucius} = require('module-lucius');
const db = require('../modules/db');
const logger = require('module-logger');
const {Team, Account} = require('../modules/db/types');

const PLUGIN_NAME = 'teams';

const predefinedTeams = () => {
  return [{id:"3f79a852-ef45-4547-bb1e-91b3bd49ad16",name:"AIESEC",teamDescription:""},{id:"ee2c91eb-9f62-4e41-9909-3ee0cc8bd324",name:"JCI Benin",teamteamDescription:""},{id:"fa6d8f72-2cf4-47ff-9ff5-25611eb9913c",name:"JCI Botswana",teamteamDescription:""},{id:"ea97b2a1-181f-45f4-b24e-01cd7e738d8c",name:"JCI Burkina Faso",teamteamDescription:""},{id:"6eeb3ab6-1faf-46e9-8bb6-0e97a61d1a4f",name:"JCI Burundi",teamteamDescription:""},{id:"2a2b6e33-47b7-4f8b-8205-a17e11681078",name:"JCI Cameroon",teamteamDescription:""},{id:"a0c90074-0754-4f9d-b91a-0814f07dcd73",name:"JCI Chad",teamDescription:""},{id:"ed5ec5cc-9fee-4ae3-b2a8-7ecf6cf669f1",name:"JCI Comoros",teamDescription:""},{id:"b5146583-a383-4467-8d00-8f401a5a6d99",name:"JCI Congo",teamDescription:""},{id:"37e6213d-c799-4f49-95a9-83f4092dd8df",name:"JCI Cote d'Ivoire",teamDescription:""},{id:"8c966e7b-0b95-422f-8609-3cf363113132",name:"JCI Dem. Rep. Congo",teamDescription:""},{id:"316e6ec3-9abe-4014-bfb1-4c9f44808d9d",name:"JCI Djibouti",teamDescription:""},{id:"ec7c4664-71cd-483b-a263-02454842d8df",name:"JCI Egypt",teamDescription:""},{id:"de94d22b-7794-446f-bad7-9d3c5e48160a",name:"JCI Gabon",teamDescription:""},{id:"cb4f525b-3b03-470d-9069-c10d0f8a3575",name:"JCI Ghana",teamDescription:""},{id:"8f6b9e3a-8da4-4b7f-85f8-7c3405f97554",name:"JCI Guinea",teamDescription:""},{id:"0b2dcb88-b43a-4c56-bd04-79321aa486a3",name:"JCI Kenya",teamDescription:""},{id:"f41a5d14-9a2c-4ac0-8e65-505947aea5ac",name:"JCI Jordan",teamDescription:""},{id:"9129ef64-5f57-4966-91f7-1b445bc33a7d",name:"JCI Lebanon",teamDescription:""},{id:"787f3e99-f653-4085-a188-2e0e20729de8",name:"JCI Lesotho",teamDescription:""},{id:"36d34967-fae6-4d40-ba23-2900d65d3957",name:"JCI Liberia",teamDescription:""},{id:"8528640c-d3ef-4574-a338-86de80e13d8c",name:"JCI Madagascar",teamDescription:""},{id:"1201eb16-bd9a-482d-a1a2-286d16dd1c6b",name:"JCI Malawi",teamDescription:""},{id:"e36af619-bd28-4624-8a8b-73c1355af974",name:"JCI Mali",teamDescription:""},{id:"fec8d69b-ded6-46ef-b538-a4295d288a6d",name:"JCI Mauritius",teamDescription:""},{id:"5cf59baf-1ecd-4d4e-9e4c-49bd2156052f",name:"JCI Morocco",teamDescription:""},{id:"d60ff26a-c227-4f16-aa16-78c914a105b6",name:"JCI Namibia",teamDescription:""},{id:"ee52bf99-ecae-4a77-b296-af45f386bee4",name:"JCI Niger",teamDescription:""},{id:"e30359a6-2ee6-42d2-91a1-0a5e4624ffc0",name:"JCI Nigeria",teamDescription:""},{id:"023325e5-7130-4938-86f1-96d624d62d8c",name:"JCI Rwanda",teamDescription:""},{id:"185b2741-a292-4d9a-af0a-287ebf2370c4",name:"JCI Senegal",teamDescription:""},{id:"b4f93741-7f14-4b10-ab0f-481dae74c74c",name:"JCI South Africa",teamDescription:""},{id:"27da1fd7-2a08-4f68-bc16-4c1f67340092",name:"JCI South Sudan",teamDescription:""},{id:"c9659537-885d-4e58-ad72-5c1268939278",name:"JCI Syria",teamDescription:""},{id:"77248d94-da18-49cb-89db-c408ec6e4b81",name:"JCI Togo",teamDescription:""},{id:"f9ddcf35-0c28-4698-9ba3-b775e5d41103",name:"JCI Tunisia",teamDescription:""},{id:"23367247-b08a-460a-8a47-b06ee2e7c443",name:"JCI Uganda",teamDescription:""},{id:"0d5aaa9f-182a-4652-8ccd-914d80d5a30d",name:"JCI Zambia",teamDescription:""},{id:"ae9fef2d-5f91-4c21-9601-685359aea8e4",name:"JCI Zimbabwe",teamDescription:""},{id:"0390fbd5-5287-4eaf-a451-f6e76d85afa2",name:"JCI Argentina",teamDescription:""},{id:"67b59399-2675-4eea-a16a-4cf0974eb483",name:"JCI Bolivia",teamDescription:""},{id:"5166fd16-a87a-4e92-87f8-8b6ee271b938",name:"JCI Brazil",teamDescription:""},{id:"c9cee11f-acd4-4547-8a31-8e38e48a915c",name:"JCI Canada",teamDescription:""},{id:"729858c2-403c-4a40-91f6-0a486a8ca057",name:"JCI Chile",teamDescription:""},{id:"98beaac9-3447-4e87-bfdd-e64d9147be88",name:"JCI Colombia",teamDescription:""},{id:"735ea7d3-61cc-436e-86e0-4c287b141541",name:"JCI Dominican Republic",teamDescription:""},{id:"d43968e8-fda2-4082-897d-d49088c0e2f6",name:"JCI Dutch Caribbean",teamDescription:""},{id:"96fe6e40-3c04-423d-b622-b55022a61cf8",name:"JCI Ecuador",teamDescription:""},{id:"ab40a2b6-6301-4d28-90af-9e5bfac6274a",name:"JCI Haiti",teamDescription:""},{id:"d3dd7229-0354-4b53-a6b1-1644a7b6111d",name:"JCI Honduras",teamDescription:""},{id:"115ddeed-cc06-4ec5-afea-d2d570d50ff8",name:"JCI Jamaica",teamDescription:""},{id:"a17f183b-b428-4b4b-ab54-c5ea25d9ebb6",name:"JCI Mexico",teamDescription:""},{id:"5991d465-ec0e-497b-acc9-db7efd4cd12a",name:"JCI Panama",teamDescription:""},{id:"38d53cd9-d108-40a9-aa02-235ca5219f94",name:"JCI Paraguay",teamDescription:""},{id:"6a4da5da-ad09-44d0-addb-dd11054326b7",name:"JCI Peru",teamDescription:""},{id:"2e98b35d-b0db-40b4-8107-56e7acad548e",name:"JCI Puerto Rico",teamDescription:""},{id:"d18b79e7-85fb-4ac0-ac2c-93c815b0f741",name:"JCI Suriname",teamDescription:""},{id:"31dd8edc-9d7b-46fb-b6c6-0bbaad6092c5",name:"JCI Uruguay",teamDescription:""},{id:"77be8620-5f49-40f7-87d7-ec749319e363",name:"JCI USA",teamDescription:""},{id:"84cecc78-c768-4fd4-be9a-bee6b1f944b6",name:"JCI Venezuela",teamDescription:""},{id:"231b9b1f-e9f1-40f8-80e1-c9912b2d8587",name:"JCI West Indies",teamDescription:""},{id:"5cae0e64-6a4f-4662-b35b-271454b8e638",name:"JCI Australia",teamDescription:""},{id:"3675bcc4-cf2f-43e8-baef-16a205ea762a",name:"JCI Bangladesh",teamDescription:""},{id:"bce16f3c-1a93-44d0-a2d3-a726fecd61f7",name:"JCI Cambodia",teamDescription:""},{id:"17cb9238-5ee0-4ddc-ab4b-4046a2477866",name:"JCI Hong Kong",teamDescription:""},{id:"70b077ef-57c3-4dbe-8079-1b7a0a6e7266",name:"JCI India",teamDescription:""},{id:"0f296c78-aeec-4195-8fd2-54003ec5d661",name:"JCI Indonesia",teamDescription:""},{id:"4fd38978-4fdd-4394-bf22-d3a05fe4a7e7",name:"JCI Japan",teamDescription:""},{id:"e6e3dd1e-46ad-47d0-9266-557197dda6a1",name:"JCI Korea",teamDescription:""},{id:"e7988b64-cd13-4896-98f6-19a213f13af7",name:"JCI Macao",teamDescription:""},{id:"5adf7c32-e688-45de-93fd-06a64120e1a0",name:"JCI Malaysia",teamDescription:""},{id:"0e42d69e-459f-4acb-a95d-480799b791f9",name:"JCI Maldives",teamDescription:""},{id:"a27c05b9-90ea-43bb-973a-2b673aebf3b7",name:"JCI Mongolia",teamDescription:""},{id:"e57d433f-7d7c-445b-9de4-12db35f225ac",name:"JCI Myanmar",teamDescription:""},{id:"8ca81811-9300-4064-9159-237b7d3db971",name:"JCI Nepal",teamDescription:""},{id:"ca1caf70-c5ed-4319-b52c-f1d8a9c815e4",name:"JCI New Zealand",teamDescription:""},{id:"3d01d4d9-7ca4-46ea-9a2f-14b8427662e0",name:"JCI Philippines",teamDescription:""},{id:"46d97f85-4310-4c37-9e8e-bb220b0bdab0",name:"JCI Singapore",teamDescription:""},{id:"233d06fa-e6b8-49b4-ab72-e083592c80c4",name:"JCI SrI Lanka",teamDescription:""},{id:"7ca60141-9c53-4214-8fdf-2008104c8c16",name:"JCI Taiwan",teamDescription:""},{id:"d9fa6094-aca9-479d-90ae-eb731af51680",name:"JCI Thailand",teamDescription:""},{id:"0358cde1-c1c6-4a2f-8205-d241146fde7c",name:"JCI Timor Leste",teamDescription:""},{id:"b070705d-c97e-484a-b4ec-cbbce4067835",name:"JCI Vietnam",teamDescription:""},{id:"d5eb170e-0aa3-4911-8429-0ce3ba8c9faa",name:"JCI Albania",teamDescription:""},{id:"20ffb9c0-df2f-44f3-be2d-19d2c2b2601d",name:"JCI Austria",teamDescription:""},{id:"5e7c820d-c2cc-46ce-80d7-c9385955682f",name:"JCI Belgium",teamDescription:""},{id:"8936671c-0b31-4454-b783-d7c3e464fe15",name:"JCI Bulgaria",teamDescription:""},{id:"69ec9ba0-3fcb-44b2-a39c-ec36a77b98c6",name:"JCI Catalonia",teamDescription:""},{id:"24e72a58-a90b-4c7e-80e4-ef2c6bc01c7d",name:"JCI Croatia",teamDescription:""},{id:"4a0d919b-2da4-4643-a647-32409e1722cb",name:"JCI Cyprus",teamDescription:""},{id:"919df300-568b-4f5c-abe5-99de27114ab3",name:"JCI Czech Republic",teamDescription:""},{id:"661b5d6b-aec5-4e4e-96f7-477b995d9911",name:"JCI Denmark",teamDescription:""},{id:"a3f934dc-3833-4205-b947-7db42b5da047",name:"JCI Estonia",teamDescription:""},{id:"73bcda20-b29c-493b-9377-5d0e962fc09d",name:"JCI Finland",teamDescription:""},{id:"f6e2758e-b297-46de-9338-f62139dfd8a8",name:"JCI France",teamDescription:""},{id:"942a9fd7-59a8-4883-8443-f70626122da8",name:"JCI Georgia",teamDescription:""},{id:"59c810a8-49da-412f-ae06-94199c4ca337",name:"JCI Germany",teamDescription:""},{id:"34fe65de-90cd-4e2f-a58d-6ae055bf9c6a",name:"JCI Greece",teamDescription:""},{id:"a1447c15-d113-4328-bcec-c77f52104c28",name:"JCI Iceland",teamDescription:""},{id:"0f4cdfd9-9148-432d-9206-041b1e4b9640",name:"JCI Ireland",teamDescription:""},{id:"6eec173c-f0c0-436a-a84d-0071f64ed551",name:"JCI Italy",teamDescription:""},{id:"c9a86efa-8ec4-442d-ab05-97294d31c810",name:"JCI Kosovo",teamDescription:""},{id:"ea1d07f8-5496-4cf6-8852-1328d5930f65",name:"JCI Latvia",teamDescription:""},{id:"1d00c55d-0b8c-44d3-aed6-48414b345344",name:"JCI Lithuania",teamDescription:""},{id:"3f403c71-301d-4164-81b7-ad32e14eba77",name:"JCI Luxembourg",teamDescription:""},{id:"3b20c8de-f7dd-4c7a-b154-fd8bbc7c8796",name:"JCI Malta",teamDescription:""},{id:"a7420bb3-51e6-492f-8166-07b54b3e94a6",name:"JCI Moldova",teamDescription:""},{id:"edf0abfd-6655-4713-86f6-e5b6d698b463",name:"JCI Monaco",teamDescription:""},{id:"2d0d8bbb-b1be-4475-95f3-a777462e7a3b",name:"JCI Netherlands",teamDescription:""},{id:"27772fa3-7b7b-490e-9713-5e7abd5e3a26",name:"JCI Norway",teamDescription:""},{id:"a246b994-76fa-4281-a465-e71f1454ca2c",name:"JCI Poland",teamDescription:""},{id:"3707df7d-6a57-43f1-99ad-38214a3c4b79",name:"JCI Portugal",teamDescription:""},{id:"18ce15fd-8d8d-407d-8844-1f6ff202da94",name:"JCI Romania",teamDescription:""},{id:"36c9605d-ce31-4afe-85b7-3691370321bd",name:"JCI Russia",teamDescription:""},{id:"e00e50ab-de7e-411e-949a-aa3a374a9aa5",name:"JCI Scotland",teamDescription:""},{id:"b657670d-e11b-4ceb-a19f-d5a5a76d6687",name:"JCI Serbia",teamDescription:""},{id:"3efcfbc6-cbe0-498f-be7a-c54fdbb14664",name:"JCI Slovakia",teamDescription:""},{id:"7508efe9-1e4c-4713-a401-29d758c4cb1e",name:"JCI Slovenia",teamDescription:""},{id:"c4bc5f99-793a-471e-9c45-befb83b748b5",name:"JCI Sweden",teamDescription:""},{id:"75f2b62a-c343-4373-a397-0c7d64b9eda8",name:"JCI Switzerland",teamDescription:""},{id:"50bf9bb7-e82e-4856-b30c-7b74869831f7",name:"JCI Turkey",teamDescription:""},{id:"42a2ae42-f96f-4ec3-9c96-cc665de2fb61",name:"JCI Ukraine",teamDescription:""},{id:"d680f1ff-3667-46e3-9f1d-4047cd7cbec4",name:"JCI United Kingdom",teamDescription:""}];
};

module.exports = function () {
    const lucius = new Lucius(this);

    lucius.pluginInit(PLUGIN_NAME, next => {
        db.ready()
            .then(() => db.seedTeams(predefinedTeams()))
            .then(() => next())
            .catch(e => next(e));
    });

    lucius.register('role:db,cmd:getAllTeams', async function (connector, args) {
        return connector.input(args)
            .use(async function ({}, responder) {
                let teams = await db.getAllTeams();
                teams.sort((a, b) => {
                    const nameA = a.name.toUpperCase();
                    const nameB = b.name.toUpperCase();

                    if (nameA > nameB) {
                        return 1;
                    } else if (nameA < nameB) {
                        return -1;
                    }
                    return 0;
                });
                return responder.success(teams);
            });
    });

    lucius.register('role:db,cmd:getCountTeamsTrashpoints', async function (connector, args) {
        return connector.input(args)
            .use(async function ({}, responder) {
                let teams = await db.getAllTeams();
                teams.sort((a, b) => {
                    const nameA = a.name.toUpperCase();
                    const nameB = b.name.toUpperCase();

                    if (nameA > nameB) {
                        return 1;
                    } else if (nameA < nameB) {
                        return -1;
                    }
                    return 0;
                });
                let i, len;
                for (i = 0, len = teams.length; i < len; i++) {
                    teams[i]['trashpoints'] = await db.countTeamTrashpoints(teams[i].id);
                    teams[i]['users'] = await db.countAccountsForTeam(teams[i].id);
                }

                return responder.success(teams);
            });
    });

    lucius.register('role:db,cmd:getTeam', async function (connector, args, __) {
        return connector.input(args)
            .use(async function ({id}, responder) {
                let team = await db.getTeam(id);
                if (!team) {
                    return responder.failure(new LuciusError(E.TEAM_NOT_FOUND, {id: id}));
                }

                return responder.success(team);
            });
    });

    return PLUGIN_NAME;
};
