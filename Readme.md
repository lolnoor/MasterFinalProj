This App is for Blood Donation management

Folder structure
    1. Admin
        i. ScreenNameFolder
            i. ScreenName.js
            ii. styles.js

        ii. ScreenNameFolder
            i. ScreenName.js
            ii. styles.js

    2. Donor
        i. ScreenNameFolder
            i. ScreenName.js
            ii. styles.js

        ii. ScreenNameFolder
            i. ScreenName.js
            ii. styles.js

    3. Comonent (Holds all the reusable component)
        i. ComponentNameFolder
            i. ComponentName.js
            ii. styles.js

    4. store
        i. index.js :- Export store with persisting enabled
        ii. UserStore :- Store to saved logged in user basic informatin details

    5. Utils
        i. Constants
            i. ChipData :- Hold common chip data. like gender, blood group
            ii. Colors  :- Color used by app
            iii. Constant 
            iv. Enums :- Emums to be used by app
            v. R  (Resource)  :- Encapsulate all the resource and export into object




Database
    Firebase Realtime database to store the application data.
        Database Structure
            root
                |--->Admin (This will store admin user information)
                |       |---> uid     (uid from firebase auth. Admin user is added manually.)  
                |               |---> emailId
                |               |---> name
                |               |---> phoneNumber
                |               |---> uid
                |               |---> userType (To keep the structure similar, all user has a userType node in the info.)
                |
                |---> donors (This will store donors information)
                |       |---> uid
                |               |---> bloodGroup
                |               |---> city
                |               |---> dob
                |               |---> donorInfo (This is kept inside donor info because firebase don't support joins as in SQL. So instead of keeping               
                |               |                  reference, we are storing all info in one node)
                |               |       |---> diseases
                |               |       |---> drink
                |               |       |---> lastAbroadVisit
                |               |       |---> lastBloodDonation
                |               |       |---> smoke
                |               |---> emailId
                |               |---> emailVerfied  (This data is provided by google at the time of login in and signup. Storing it for future uses)
                |               |---> gender
                |               |---> name
                |               |---> token     (Push notification token of the user)
                |               |---> uid       (Same as node uid. Storing it inside the object so that I don't have to keep track of the parent.)
                |               |---> userType  (donor)
                |
                |
                |---> hospitals (This will store hospital information)
                |       |---> uid
                |               |---> city
                |               |---> completeAddress
                |               |---> country
                |               |---> emailId
                |               |---> emailVerified
                |               |---> licenseNo
                |               |---> name
                |               |---> phoneNumber
                |               |---> token
                |               |---> uid
                |               |---> userType (Hospital)
                |
                |
                |---> users     (This node store all the user, regardless of there type. and also their usertype)
                |       |---> uid
                |               |---> uid
                |               |---> userType
                |
                |---> donor_notification   (This will store all the notification group by donor uid)   
                |       |---> uid (donor uid)
                |               |---> donorInfo
                |               |       |---> ... all Donor Info
                |               |
                |               |---> expireOn 
                |               |---> hospitalInfo
                |               |       |--->  ... all Hospital Info
                |               |
                |               |---> message
                |               |---> notificationId
                |               |---> sendOn
                |               |---> status
                |
                |
                |---> hospital_notification (This will store all the notification group by hospital uid)
                |       |---> uid (hospital uid)
                |               |---> same info as in donor_notification



Justification of the database
    1. users Node
            This node will store all the users along with their type. This node is very important. After login, firebase auth will give us a uid,
            from this uid, we will fetch the data from users node, which will return userType. Now with userType we will request appropriate node (donors,
            hospital or admin) with uid to get the completed info of the login user. 

    2. Same data in donor_notification and hospital_notification
            donor_notification and hosptial_notification store the same data, but under different uid. donor_notification stores the data with donor prospective.
            So that a donor can just request data of his own. As firebase don't support filtering on the basis of internal nodes, if we keeps a single copy of
            notification then we need to fetch all the notification data and filter on the basis of uid at the mobile side. This is increase payload size, hence 
            duration of the request and unnecessary waste of bandwidth.
    
    3. Notification contain donorInfo and hosptialInfo
            This is to show userInfo and hospital info on the notification card. Without it we need to request the data for every donor and user
            for every notification which will make the system slow and unreliable. Also firebase recommand to keep the structure flat and duplicate data
            if necessary than storing the reference

    4. donorInfo inside donor
            donorInfo can be stored in different node, but for the reference reason above stated, it is stored inside donor. Now, as the donorInfo node 
            make a different logical group (they are questionnary), it is better to keep then inside a parent node

    5. Every userType is stored under different node.
            If can also store then under one node, but with that we will have a difficulty in finding a particular type of user. For example, if we need 
            to get all the donors, then we have to fetch all the users and then on mobile side we have to apply filter.
          
 

    <!-- https://itnext.io/easily-integrate-mobx-into-react-native-app-with-expo-and-react-navigation-29ecf7c14012 -->
    Mobx to store logged in user data

    <!-- https://medium.com/@Zwenza/how-to-persist-your-mobx-state-4b48b3834a41 -->
    Mobx-persist to persist the mobx store data across different app sessions

Reusability/Maintainablity
    1. Many wrapper component are created to encapsulate the the native component 
       and apply common styling.

    2. All the common logic has been extracted to common Helperfunction file.

UI Design
    1. This app don't use any ui library for its UI
    2. Every component uses styles.js to apply styles
    3. Use of Wrapper component allow for a consistant look across the whole app
    4. Every screen is encapsulated in ScreenContainer which holds the background of the app
    5. Scren Container also include Loading animation 
    6. App is rich in Animation which is implemented using LayoutAnimation, Animated Api.
    7. Loading screen is implemented using Lottie Animation, which is high performance, svg based animation.

Coding Style
    1. Follows camelCase naming convension
    2. Constants and Enums are defined in all caps 


