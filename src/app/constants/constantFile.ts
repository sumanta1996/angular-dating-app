import { User } from "../common/user";

export class ConstantData {
    public static states = [{"code": "AN","name": "Andaman and Nicobar Islands"},
    {"code": "AP","name": "Andhra Pradesh"},
    {"code": "AR","name": "Arunachal Pradesh"},
    {"code": "AS","name": "Assam"},
    {"code": "BR","name": "Bihar"},
    {"code": "CG","name": "Chandigarh"},
    {"code": "CH","name": "Chhattisgarh"},
    {"code": "DH","name": "Dadra and Nagar Haveli"},
    {"code": "DD","name": "Daman and Diu"},
    {"code": "DL","name": "Delhi"},
    {"code": "GA","name": "Goa"},
    {"code": "GJ","name": "Gujarat"},
    {"code": "HR","name": "Haryana"},
    {"code": "HP","name": "Himachal Pradesh"},
    {"code": "JK","name": "Jammu and Kashmir"},
    {"code": "JH","name": "Jharkhand"},
    {"code": "KA","name": "Karnataka"},
    {"code": "KL","name": "Kerala"},
    {"code": "LD","name": "Lakshadweep"},
    {"code": "MP","name": "Madhya Pradesh"},
    {"code": "MH","name": "Maharashtra"},
    {"code": "MN","name": "Manipur"},
    {"code": "ML","name": "Meghalaya"},
    {"code": "MZ","name": "Mizoram"},
    {"code": "NL","name": "Nagaland"},
    {"code": "OR","name": "Odisha"},
    {"code": "PY","name": "Puducherry"},
    {"code": "PB","name": "Punjab"},
    {"code": "RJ","name": "Rajasthan"},
    {"code": "SK","name": "Sikkim"},
    {"code": "TN","name": "Tamil Nadu"},
    {"code": "TS","name": "Telangana"},
    {"code": "TR","name": "Tripura"},
    {"code": "UK","name": "Uttarakhand"},
    {"code": "UP","name": "Uttar Pradesh"},
    {"code": "WB","name": "West Bengal"}];

    public static MW = "MW";
    public static M = "M";
    public static W = "W";
    public static Bisexual = "Bisexual";
    public static Straight = "Straight";
    public static Gay = "Gay";

    public static sexuality = [
        {"code": ConstantData.MW, "name": "Intersted in Men and Woman"},
        {"code": ConstantData.M, "name": "Intersted in Men"},
        {"code": ConstantData.W, "name": "Intersted in Woman"}
    ];

    public static checkForSexuality(user: User) {
        if(user.sexuality) {
            if(user.sexuality === ConstantData.MW) {
                return ConstantData.Bisexual;
            }else if(user.sexuality === ConstantData.M) {
                if(user.gender === 'M') {
                    return ConstantData.Gay;
                }else {
                    return ConstantData.Straight;
                }
            }else if(user.sexuality === ConstantData.W) {
                if(user.gender === 'F') {
                    return ConstantData.Gay;
                }else {
                    return ConstantData.Straight;
                }
            }
        }

        return "";
    }
}