import LoadingGif from "../images/loading.gif";

const Loader = () => {
  return (
    <div className="loader">
      <div className="loader__image">
        <img src={LoadingGif} alt="Spinner" />
      </div>
    </div>
  );
};

export default Loader;
