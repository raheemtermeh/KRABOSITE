const LoadingBar=()=>{
    return(<>
    <div className="progress" style={{ height: '5px', marginBottom: '10px'}}>
          <div
            className="progress-bar progress-bar-striped progress-bar-animated "
            role="progressbar"
            style={{ width: '100%' ,backgroundColor:"#880a0a"}}
            aria-valuenow="100"
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
    </>)
}
export default LoadingBar