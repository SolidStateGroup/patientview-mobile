const KB = 1000;
const MB = 1000000;
{/*<a href="https://imgbb.com/"><img src="https://image.ibb.co/mwWfi8/Pasted_image_at_2018_05_23_03_22_PM.png" alt="Pasted_image_at_2018_05_23_03_22_PM" border="0"></a>*/}
{/*<a href="https://ibb.co/hjCmO8"><img src="https://preview.ibb.co/bL7Li8/Pasted_image_at_2018_05_23_03_19_PM.png" alt="Pasted_image_at_2018_05_23_03_19_PM" border="0"></a>*/}
{/*<a href="https://imgbb.com/"><img src="https://image.ibb.co/dkU838/image.png" alt="image" border="0"></a>*/}
{/*a*/}
global.Constants = {
    exampleMedia: [{
        title: "May 2018",
        data: [
            {
                id: 1,
                type: "IMAGE",
                localPath: "123",
                filesize: MB,
                url: "https://image.ibb.co/mwWfi8/Pasted_image_at_2018_05_23_03_22_PM.png",
                width: 1920,
                height: 1080
            },
            {
                id: 2,
                filesize: MB*1.4,
                type: "IMAGE",
                localPath: "1233",
                url: "https://preview.ibb.co/bL7Li8/Pasted_image_at_2018_05_23_03_19_PM.png",
                width: 1920,
                height: 1080
            },
            {
                id: 3,
                filesize: MB*1.4,
                type: "IMAGE",
                localPath: "1234",
                url: "https://image.ibb.co/dkU838/image.png",
                width: 1920,
                height: 1080
            }
        ],
    }],
    secretWordLength: 7, //Minimum length of secret word
    chartExtend: { //Converts extend values to readable string
        0: "None",
        6: "6 Months",
        12: "1 Year",
        36: "3 Years",
        60: "5 Years",
        120: "10 Years",
    },
    resultSort: {
        "RECENT": "Most recent",
        "ALPHABETICALLY": "Alphabetical",
        "REVERSE_ALPHABETICALLY": "Reverse Alphabetical",
    },
    urineProteinDipstick: {
        'NEGATIVE': 'Negative',
        'TRACE': 'Trace',
        'ONE': 'One+',
        'TWO': 'Two+',
        'THREE': 'Three+',
        'FOUR': 'Four+',
    },
    oedemas: {
        'NONE': 'None',
        'ANKLES': 'Ankles',
        'LEGS': 'Legs',
        'HANDS': 'Hands',
        'ABDOMEN': 'Abdomen',
        'NECK': 'Neck',
        'EYES': 'Eyes',
    },
    relapseMedication: {
        'ORAL_PREDNISOLONE': 'Oral Prednisolone',
        'METHYL_ORAL_PREDNISOLONE': 'Methyl Prednisolone',
        'OTHER': 'Other',
    },
    relapseMedicationFrequency: {
        'ONE_DAY': 'once a day',
        'TWO_DAY': 'X2 a day',
        'THREE_DAY': 'X3 a day',
        'FOUR_DAY': 'X4 a day',
    },
    relapseMedicationUnits: {
        'MG': 'Mg',
        'G': 'g',
        'IU': 'iU',
    },
    relapseMedicationRoutes: {
        'ORAL': 'Oral',
        'IV': 'IV',
        'IM': 'IM',
    },
    immunisationCodes: {
        MMR: 'MMR',
        PNEUMOCCAL: 'Pneumoccal',
        ROTAVIRUS: 'Rotavirus',
        MEN_B: 'MenB',
        MEN_ASWY: 'MenACWY',
        VERICELLA: 'Varicella',
        HIB_MENC: 'Hib/MenC',
        FLU: 'Flu',
        HPV: 'HPV',
        OTHER: 'Other',
    },
    simulate: { //Simulate certain events to test the behaviour
        SCREENSHOT: false, //Always alert file upload is too big
        FILESIZE_WARNING: false, //Always alert file upload is too big
        TIMED_TOKEN: false, //Always timeout login token
        SHOULD_CHANGE_PASSWORD: false, //Treat user as new
        NO_SECRET_WORD: false, //Always tell user to set a secret word on login
        NOT_READ_RESULTS: false, //Simulate new, unread resu;ts
        NO_RESULTS: false, //Simulate no results
        NO_LOCAL_IMAGE: false, //Simulate uploaded media being deleted from device (forces to fetch from api)
    },
    navEvents: {
        SHOW: 'didAppear',
        HIDE: 'didDisappear'
    },
    //My media
    maxFilesize: 5 * MB,
    maxFilesizeString: "5MB",
    maxMyMedia: 50 * MB,
    maxMyMediaString: "50MB",

    //Max attempts before locking account
    loginAttempts: 10,
    biometricLoginAttempts: 5, // Android only
};

module.exports = Constants;
