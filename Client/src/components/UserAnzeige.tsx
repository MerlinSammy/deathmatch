function UserAnzeige(props: any) {
  return (
    <>
      <div className="bg-primary p-2 d-flex">
        <h1 className="athleteInfo p-2">
          Gewicht: {props.cw}kg | Runde: {props.runde} | {props.person} | Best PR: {props.pr}kg
        </h1>
        <div className="d-flex justify-content-center gap-2 ms-4 align-items-center">
          <div className="circle bg-primary"></div>
          <div className="circle bg-primary"></div>
          <div className="circle bg-primary"></div>
        </div>
      </div>
    </>
  );
}

export default UserAnzeige;
