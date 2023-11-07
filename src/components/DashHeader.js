import {ReactComponent as Logo} from '../img/logo-l.svg'
import AvatarChip from './AvatarChip'
const DashHeader = () => {

    const content = (

       <div className='dash-header-container' style={{display:'flex',justifyContent:'space-between'}}>
        {/* <ToogleThemeButton /> */}
        <div className='dash-header-logo-text'>
            <Logo className='dash-header-logo'/>
            <h4 style={{color:'#6F6D76',margin:0,marginBottom:10,marginLeft:10,fontSize:30}}>Academy</h4>
        </div>

        <AvatarChip/>

        {/* <RefreshButton /> */}
         
       </div>
    )


    return content
}
export default DashHeader