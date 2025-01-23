import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const segments = ['12', '34', '56', '14', '36', '16'];
  const slots = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'P', 'Q', 'R', 'S', 'W', 'X', 'Y', 'Z'];

  const initialStore = segments.map(() =>
    slots.map(() => ({
      courseName: "",
      courseCode: "",
      instructor: "",
      venue: "",
    }))
  );

  const [state, setState] = useState(initialStore);
  const [selectedSegment, setSelectedSegment] = useState(0);
  const [editCell, setEditCell] = useState({ slotIndex: null });

  const handleChange = (event, slotIndex) => {
    const { name, value } = event.target;
    const updatedState = [...state];
    updatedState[selectedSegment][slotIndex] = {
      ...updatedState[selectedSegment][slotIndex],
      [name]: value,
    };
    setState(updatedState);
  };

  const saveToDatabase = async (slotIndex) => {
    const data = {
      segment: segments[selectedSegment],
      slot: slots[slotIndex],
      ...state[selectedSegment][slotIndex],
    };

    try {
      const response = await fetch('http://localhost:5000/api/schedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      alert('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save data.');
    }
  };


  return (
    <div>
      <h1>Course Scheduler</h1>

      <div className='flex gap-3 items-center justify-evenly'>
        {segments.map((seg, index) => (
          <button
            key={index}
            className={selectedSegment === index ? 'active-tab' : ''}
            onClick={() => setSelectedSegment(index)}
          >
            Segment {seg}
          </button>
        ))}
      </div>

      <div className="content flex flex-col gap-5 items-center justify-center">
        <h2>Segment {segments[selectedSegment]}</h2>

        {slots.map((slot, j) => (
          <div key={j} className="slot">
            {editCell.slotIndex !== j ? (
              <button onClick={() => setEditCell({ slotIndex: j })}>
                New Event for {slot}
              </button>
            ) : (
              <>
                <h6>Slot - {slot}</h6>
                <form>
                  <label>
                    Course Name:
                    <input
                      type="text"
                      name="courseName"
                      placeholder="Course Name"
                      value={state[selectedSegment][j].courseName}
                      onChange={(e) => handleChange(e, j)}
                    />
                  </label>
                  <label>
                    Course Code:
                    <input
                      type="text"
                      name="courseCode"
                      placeholder="Course Code"
                      value={state[selectedSegment][j].courseCode}
                      onChange={(e) => handleChange(e, j)}
                    />
                  </label>
                  <label>
                    Venue:
                    <input
                      type="text"
                      name="venue"
                      placeholder="Venue"
                      value={state[selectedSegment][j].venue}
                      onChange={(e) => handleChange(e, j)}
                    />
                  </label>
                  <label>
                    Instructor:
                    <input
                      type="text"
                      name="instructor"
                      placeholder="Instructor"
                      value={state[selectedSegment][j].instructor}
                      onChange={(e) => handleChange(e, j)}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      saveToDatabase(j);
                      setEditCell({ slotIndex: null });
                    }}
                  >
                    Save
                  </button>
                </form>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
