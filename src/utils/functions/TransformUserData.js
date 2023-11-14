export default function transform_users_data(users){
  
  const user_transformed_data = users.map(user => {
        
    const name = user.Discord_Infos.displayName
    const img = user.Discord_Infos.avatar_url || require('../../img/discord.svg')

    let one_good = false;
    let one_wrong = false;

    for(const key in user.Student_Perks){
      const actual = user.Student_Perks[key]
      if(key === "_id") continue
      if(!Array.isArray(actual)){
        console.log('ERROR IS NOT ARRAY');
        continue
      }
      if(!actual.length){
        one_wrong = true;
      } else {
        one_good = true;
      }
    }

    const status = user.Journey_Infos.blocs?.length ?  (user.Journey_Infos.blocs.some(bloc=>(!bloc.reviewed && !bloc.reviews?.length)&& bloc.completed) ? "Not reviewed" : user.Journey_Infos.blocs.some(bloc=>!bloc.reviewed) ? 'In progress' : user.Journey_Infos.progress === 19 ? 'Finished' : 'Reviewed') : 'Just started';
    const fiche_state_color = (one_good && one_wrong) ? '🟠' : !one_wrong ? '🟢' : '🔴' ;
    const progress = user.Journey_Infos.progress
    const subscription = user.Discord_Infos.grade
    const user_id = user._id
    
    return {name, status, fiche_state_color, progress, img, subscription, user_id}

  })
  return user_transformed_data
}