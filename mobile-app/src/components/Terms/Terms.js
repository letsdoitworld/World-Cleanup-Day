import React from 'react';
import { ScrollView, Text } from 'react-native';
import styles from './styles';


class Terms extends React.Component {
  defaultProps = {
    style: {},
  };

  render() {
    return (
      <ScrollView style={{ paddingLeft: 16, paddingRight: 17 }}>
        <Text style={[styles.title, { marginTop: 17 }]}>
          Terms and Conditions
        </Text>
        <Text style={styles.description}>Valid as of June 2018</Text>
        <Text style={styles.description}>These terms and conditions (hereinafter
          <Text style={{ fontWeight: 'bold' }}>Terms and Conditions</Text>) govern
          the use of the Let’s Do It World application (hereinafter
          <Text style={{ fontWeight: 'bold' }}>LDI App</Text>) by users.
        Contractual party of the user is:</Text>
        <Text style={styles.description}>Let’s Do It Foundation (hereinafter LDI) is
           registered with the Estonian Registry of non-profit organisations and is
           governed by the laws of the Republic of Estonia.
        </Text>
        <Text style={[styles.description, { marginLeft: 15 }]}>
          - Teeme Ära Sihtasutus (registry code 90010442, address
           Telliskivi tn 60a,
           Põhja-Tallinna district, Tallinn city,
            Harju county, Estonia 10412) (hereinafter LDI).</Text>
        <Text style={styles.description}>These terms are available in English language.
        </Text>
        <Text style={styles.description}>
          LDI will preserve the text of the Terms and Conditions and the version
           of the Terms and Conditions which
           is currently in force will remain available to the users via the LDI App.
            However, we encourage the users to
            save or print these Terms and Conditions for future reference.
        </Text>
        <Text style={styles.title}>
          {"The goal of Let's Do It! World and the LDI App"}
        </Text>
        <Text style={styles.description}>
          LDI is an organization powered by volunteers who make our activities succeed.
          Let’s Do It! World is a global civic movement with a mission to connect and
          empower people and organisations around the world to make our planet waste free.
          We intendto unite against illegal waste, organising a global cleanup on 15
          September 2018, bringing together 150 countries for one positive cause
          – a clean world.
        </Text>
        <Text style={styles.description}>
          The LDI App was created to promote the
          {"Let's"} Do It! World” project and map the illegal trash globally.
          The LDI App enables users to mark trash on the map and to see trash
          locations marked on the map by other users.Users can create Teams and Events
          to engage more people to the mapping and cleanup activities.
        </Text>
        <Text style={styles.title}>
          Using the LDI App
        </Text>
        <Text style={styles.description}>
          These Terms and Conditions are binding on any use of the LDI App by the user.
          By using the LDI App, the user agrees that it has read and agrees to be bound
          by the Terms and Conditions. The latest versions of Terms and Conditions are
          published in the Terms and Conditions section of the LDI App.
        </Text>
        <Text style={styles.title}>
          Registering with LDI
        </Text>
        <Text style={styles.description}>
          When registering on the LDI App, the
          user will be asked to sign up with a social media account.
        </Text>
        <Text style={styles.title}>
          Providing data
        </Text>
        <Text style={styles.description}>
          The user confirms that it has all rights and consents for disclosing to LDI any
          data, including any personal data, submitted while using the LDI App. Users will
          be required to provide accurate and complete data regarding themselves, as
          required in the registration form. Users will be required to update their
          personal data when the information previously provided in the registration
          form no longer corresponds to reality. If the data provided by the users turns
          out not to be true or to be inaccurate or incomplete, LDI, through its
          representatives, may suspend or permanently close the user’s account, any
          further attempt registration on the LDI App not being allowed. The processing
          of personal data provided by users is governed by the Privacy Policy of the LDI
          App, which is available at Privacy Policy (open with external browser).
        </Text>
        <Text style={styles.title}>
          Data security
        </Text>
        <Text style={styles.description}>
          The user is responsible for maintaining the confidentiality of his password.
          The user is responsible for how his account is used. Users understand and
          agree not to use the account or the password of other users. If you notice
          any unauthorized use of your account, as well as any violation of the
          confidentiality of personal data, you are obliged to inform LDI. If the user
          breaches these Terms and Conditions, LDI may limit or block access to
          a {"member's"} account, without prior notice.
        </Text>
        <Text style={styles.title}>
          Using LDI information
        </Text>
        <Text style={styles.description}>
          Information contained in the LDI App is intended to be used by users for
          information and interconnection with other users and cannot be marketed in
          any form. Using information from the LDI App in an illegal or unauthorized way,
          including but not limited to collecting usernames, email addresses, photographs
          or any information or data of other users for the purposes of commercialization,
          distribution, spamming or similar purpose is strictly prohibited.
        </Text>
        <Text style={styles.description}>
          Users are solely liable for how they use the information about trash locations
          provided in the LDI App, including their activities if they access or remove the
          trash. LDI is not liable for the activities of users who access or remove the
          trash. Publication of a trash location on the LDI App does not constitute an
          approval or request by LDI to remove the trash. Users acknowledge that accessing
          trash locations published on the LDI App and removing the trash may
          be dangerous or illegal.
        </Text>
        <Text style={styles.description}>
          Events and Teams created by LDI App users are not organized by LDI. LDI is not
          liable for theactivities of users who join Events and/or Teams. Event creator
          is personally responsible of participants security.
          Only users with public profile can create Events and Teams,
          they have to provide their phone number and email address to make
          contacting with them possible.
        </Text>
        <Text style={styles.title}>
          Prohibited actions on LDI App
        </Text>
        <Text style={[styles.description, { marginBottom: 0 }]}>
          Following actions are strictly prohibited on the app:
        </Text>
        <Text style={styles.listItem}>
          a) publishing obscene, offensive, violent, defamatory,
          discriminatory, racist, chauvinist material;
        </Text>
        <Text style={styles.listItem}>
          b) publication of advertising or promotional materials or
          other forms of marketing of goods or services;
        </Text>
        <Text style={styles.listItem}>
          c) publication or dissemination of sexually explicit materials
          or sending links to websites for adults
        </Text>
        <Text style={styles.listItem}>
          d) dissemination or transmission of viruses, worms or programs
          designed to destroy operating systems;
        </Text>
        <Text style={styles.listItem}>
          e) upload, post or otherwise transmit material like {'"junk mail,"'}
          {'"spam,” “chain letters”,'} pyramid schemes or other
          forms of unauthorized applications;
        </Text>
        <Text style={styles.listItem}>
          f) request of other LDI App {"user's"} account password;
        </Text>
        <Text style={styles.listItem}>
          g) uploading, posting, dissemination or transmission of
          content which infringes the rights of third persons;
        </Text>
        <Text style={styles.listItem}>
          h) promoting information that the user knows to be false or promoting illegal
          activities or abusive, obscene, threatening, libellous material;
        </Text>
        <Text style={styles.listItem}>
          i) promoting or providing information about the development of illegal
          activities, promote physical or verbal violence against any group or
          persons or promoting any act of cruelty to animals;
        </Text>
        <Text style={styles.listItem}>
          j) promoting instructions for making illegal or criminal activities;
        </Text>
        <Text style={styles.listItem}>
          k) publishing material protected by copyright, for which there is
          no permission for publication and dissemination.
        </Text>
        <Text style={styles.description}>
          LDI may delete and remove materials that feature prohibited content
          and may at any time suspend or block the {"user's"} account which aired
          or promoted materials including such content. Also, LDI may take legal
          action against the user who published content which is prohibited
          on the LDI App.
        </Text>
        <Text style={styles.description}>
          LDI is not monitoring and controlling the actions of its users on LDI App.
          LDI does not control the accuracy of the information provided by users,
          available on the LDI App. LDI accepts no responsibility for the content
          published by its users. The users are solely liable for the compliance
          of user-provided content to these Terms and Conditions, third party
          rights and applicable law.
        </Text>
        <Text style={styles.title}>
          Use of content
        </Text>
        <Text style={styles.description}>
          Content means all user related information contained in the app as text,
          data, software and still images. The content of the website (open with
          external browser) and the LDI App cannot be taken, distributed, sold or
          resold without the written consent of LDI. Unauthorized use of the information,
          brands or any users’ data on LDI App is strictly prohibited.
          In case of violation of these provisions,
          LDI reserves the right to seek legal support for violation of its rights.
        </Text>
        <Text style={styles.title}>
          Copyright
        </Text>
        <Text style={styles.description}>
          Any intellectual property rights related to the LDI App remain the property of
          LDI. These Terms and Conditions do not grant the user any rights to
          use the LDI intellectual property without the prior express consent of LDI,
          except the right to use the LDI App for its intended purpose.
        </Text>
        <Text style={styles.description}>
          Users grant to LDI a non-exclusive, free, transferable,
          sub-licensable, worldwide licence to use the content,
          including photos and text, that users post on the LDI App.
        </Text>
        <Text style={styles.description}>
          Users have ownership over their content on the app, and can use it any
          way they want or deem necessary. However, by posting pictures or texts on LDI
          App, users give the LDI the right to use, modify, reproduce, broadcast or
          distribute
          the content submitted by them. By posting any pictures on LDI App and website,
          users ensure that all content is owned by the user or has the right to use such
          content and that posting content does not
          violate the copyright or intellectual property of any person or entity.
        </Text>
        <Text style={styles.title}>
          Links to other websites
        </Text>
        <Text style={styles.description}>
          LDI App may provide links to other websites or resources. LDI has no control
          over such sites and resources and is not responsible for the content published
          on these websites or resources. Furthermore, the LDI will not be responsible or
          liable to pay compensation, directly or indirectly, for any damage or loss
          caused or alleged to be caused by or in connection with use of or reliance on
          the information provided by the content,
          goods or services available on or via such websites or resources.
        </Text>
        <Text style={styles.title}>
          Disclaimer
        </Text>
        <Text style={[styles.description, { marginBottom: 0 }]}>
          Users understand and agree to the following:
        </Text>
        <Text style={styles.listItem}>
          a) the use of information and services on LDI App is at your own risk.
          Services are provided on an {'"as is" and "as available"'} basis.
        </Text>
        <Text style={styles.listItem}>
          b) LDI does not guarantee that: services will be uninterrupted,
          timely, secure or error free;
        </Text>
        <Text style={styles.listItem}>
          c) Information published on the LDI App might be incorrect or not accurate;
          services may not meet all {"user's"} needs;
        </Text>
        <Text style={styles.listItem}>
          d) any written information obtained on or through LDI App will not create
          any liability against the LDI, if it is not specifically provided herein
          or required by applicable law.
        </Text>
        <Text style={styles.title}>
          Liability
        </Text>
        <Text style={styles.description}>
          To the maximum extent permitted by law, LDI shall not be liable for any damages
          resulting from the use or inability to use the LDI App by the user or any
          unauthorised access to or interruption, alteration, loss or deletion of the
          data submitted by the user. Furthermore, LDI shall in no event be liable for
          indirect damages, including loss of profit.
        </Text>
        <Text style={styles.description}>
          Limitations and exclusions of liability described in this section do not apply
          insofar such liability cannot be restricted or excluded in accordance with the
          applicable legislation.
        </Text>
        <Text style={styles.description}>
          The user agrees to indemnify, defend, and hold harmless LDI and its
          third party service providers from and against any claim, demand, loss, damage,
          cost, or liability (including reasonable legal fees) arising out of or relating
          to
          any content submitted, transferred or made available through the LDI App by
          the user,
          or misuse of the LDI App by the user, the breach or alleged breach of any of
          these
          Terms and Conditions and violation of any
          rights (including intellectual property rights) of a third party.
        </Text>
        <Text style={styles.title}>
          Changes in the LDI App
        </Text>
        <Text style={styles.description}>
          LDI may at any time unilaterally suspend, modify, add or delete
          parts of the content provided on the LDI App.
        </Text>
        <Text style={styles.title}>
          Other provisions
        </Text>
        <Text style={styles.description}>
          LDI may amend these Terms and Conditions at any time, notifying the users via
          the LDI App. By continuing to use the LDI App after being notified of the
          amendments, the user agrees to the amended Terms and Conditions. If the user
          does not agree to these amendments, or any particular amendment, the user
          may not be able to continue to use the LDI App.
        </Text>
        <Text style={styles.description}>
          LDI is entitled to transfer any of their rights or obligations arising
          from these Terms and Conditions to third persons without the prior
          consent of the user.
        </Text>
        <Text style={styles.title}>
          Governing law and dispute resolution
        </Text>
        <Text style={styles.description}>
          The laws of the Republic of Estonia shall apply to the
          implementation and interpretation of these Terms and Conditions.
        </Text>
        <Text style={styles.description}>
          All disputes arising out of or relating to these Terms and Conditions,
          or the breach, termination or invalidity hereof, which the parties fail
          to resolve by means of negotiations, shall be referred to Harju County Court
          (Harju Maakohus) in Tallinn, Estonia.
        </Text>
        <Text style={styles.title}>
          Contact details
        </Text>
        <Text style={styles.description}>
          Please send all notices under the Terms and Conditions to LDI to the e-mail
          address listed below.
        </Text>
        <Text style={styles.description}>
          Contact details:
            Teeme Ära Sihtasutus
            Telliskivi 60a
            Tallinn 10412
            Estonia
        </Text>
        <Text style={[styles.description, { marginBottom: 100 }]}>
          E-mail: info@letsdoitworld.org
        </Text>
      </ScrollView>
    );
  }
}

export default Terms;
