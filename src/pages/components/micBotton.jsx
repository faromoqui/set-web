import styles from './../css/voice.module.css';

export const MicButton = ({ isRecording, handleClick }) => {
  const micButtonClassName = isRecording ? styles.micOn : styles.micOff;
  const iconClassName = `${styles.icon} ${isRecording ? styles.iconOn : ''} ${styles.iconThick}`;

  return (
    <div id="micButton" className={`${styles.micContainer} ${micButtonClassName}`} onClick={handleClick}>
      <svg className={iconClassName} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
        {isRecording ? (
          <path d="M480-420.001q-41.922 0-70.961-29.038-29.038-29.039-29.038-70.961v-240q0-41.922 29.038-70.961 29.039-29.038 70.961-29.038t70.961 29.038q29.038 29.039 29.038 70.961v240q0 41.922-29.038 70.961-29.039 29.038-70.961 29.038ZM450.001-160v-101.848q-89.308-10.307-153.077-73.384-63.769-63.077-74.692-153.769,-1.615-12.769 6.692-21.884Q237.232-520 250.001-520q12.769 0 21.384 8.807 8.615 8.808 11.461 21.577 10.923 73.462 67.192 121.539Q406.307-320 480-320q74.693 0 130.462-48.577 55.769-48.577 66.692-121.039 2.846-12.769 11.461-21.577Q697.23-520 709.999-520t21.077 9.115q8.307 9.115 6.692 21.884-10.923 88.692-74.192 152.577-63.269 63.884-153.577 74.576V-160q0 12.769-8.615 21.384T480-130.001q-12.769 0-21.384-8.615T450.001-160Z" />
        ) : (
          <path d="m689.614-392.771-44.153-44.923q5.692-10.922 10.461-24.192 4.769-13.269 7-28.345Q665.768-503 674.383-511.5q8.616-8.5 21.384-8.5 12.769 0 21.077 9.307 8.307 9.308 7.077 22.077,-3.846 27.384-12.577 51.115,-8.73 23.73-21.73 44.73Zm-128.77-130.001L365.77-718.616V-760q0-41.922 29.038-70.961 29.038-29.038 70.96-29.038 41.923 0 70.961 29.038 29.038 29.039 29.038 70.961v213.844q0 6.769-1.539 12.307,-1.538 5.539-3.384 11.077ZM435.769-160v-101.694q-89.308-10.461-153.077-73.538Q218.923-398.309 208-489.001q-1.615-12.769 6.693-21.884Q223-520 235.769-520t21.384 8.807q8.615 8.808 11.461 21.577 10.923 73.462 67.192 121.539Q392.076-320 465.768-320q38.616 0 72.578-13.769 33.961-13.77 60.115-38.155l42.769 42.768q-29 27.231-66.001 44.847,-37 17.615-79.462 22.615V-160q0 12.769-8.615 21.384t-21.384 8.615q-12.769 0-21.384-8.615T435.769-160Zm337.847 47.536L88.231-797.849q-8.307-8.307-8.5-20.884-.192-12.576 8.5-21.268 8.692-8.693 21.076-8.693 12.385 0 21.077 8.693l685.385 685.385q8.307 8.307 8.5 20.884.192 12.576-8.5 21.268,-8.692 8.693-21.076 8.693,-12.385 0-21.077-8.693Z" />
        )}
      </svg>
    </div>
  );
};