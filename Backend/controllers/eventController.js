class EventController {
    async createEvent(req, res) {
        try {
            const eventData = req.body;
            const newEvent = new Event(eventData);
            await newEvent.save();
            res.status(201).json(newEvent);
        } catch (error) {
            res.status(500).json({ message: 'Error creating event', error: error.message });
        }
    }

    async getEvents(req, res) {
        try {
            const events = await Event.find();
            res.status(200).json(events);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching events', error: error.message });
        }
    }

    async getEventById(req, res) {
        try {
            const { id } = req.params;
            const event = await Event.findById(id);
            if (!event) {
                return res.status(404).json({ message: 'Event not found' });
            }
            res.status(200).json(event);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching event', error: error.message });
        }
    }
}

module.exports = new EventController();