import React from 'react';

const UserGuide = () => {
    return (
        <div className='User Guide' style={{
            display: "flex", justifyContent: "center",
            paddingTop: "50px",
        }}>
            <div className="sl-embed" style={{
                position: "relative",
                paddingBottom: "calc(62.67% + -38px)",
                width: "calc(100% - 100px)",
                height: "0",
                transform: "scale(1)"
            }}>
                <iframe
                    src="https://app.storylane.io/demo/l2ekzl2owm9g"
                    allowFullScreen=""
                    style={{
                        position: "absolute",
                        top: "0px",
                        left: "0px",
                        width: "100%",
                        height: "100%",
                        border: "none",
                    }}
                ></iframe>
            </div>
        </div>
    )
}

export default UserGuide


///https://app.storylane.io/demo/l2ekzl2owm9g
   /// style={} "position:relative;padding-bottom:calc(62.67% + 27px);width:100%;height:0;transform:scale(1)"

///"position:absolute;top:0;left:0;width:100%;height:100%;border:none;"