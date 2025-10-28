import { createNativeStackNavigator as createNativeStackNavigator_3 } from '@react-navigation/native-stack';
import { Community } from '../../screens/Community/Community';
import { PostDetails } from '../../screens/Community/PostDetails';


export const CommunityStack = createNativeStackNavigator_3({
screens: {
Community: { screen: Community },
PostDetails: { screen: PostDetails },
},
});