import React from 'react'
import './user-info.scss'

const UserInfo = ({ user }) => {
    return (
        <div className='user-info'>
            <div className="user-info__img">
                <img src={user.img} alt=""  style={{width: '50px', marginLeft: '8px', alignItems: 'center', justifyContent: 'center'}}/>
            </div>
            {/* <div className="user-info__name">
                <span>{user.name}</span>
            </div> */}
        </div>
    )
}

export default UserInfo
