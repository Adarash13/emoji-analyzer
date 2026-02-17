from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class AnalysisHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    joy = db.Column(db.Float, default=0)
    sadness = db.Column(db.Float, default=0)
    anger = db.Column(db.Float, default=0)
    fear = db.Column(db.Float, default=0)
    surprise = db.Column(db.Float, default=0)
    love = db.Column(db.Float, default=0)
    neutral = db.Column(db.Float, default=0)
    
    def to_dict(self):
        return {
            'id': self.id,
            'text': self.text[:100] + '...' if len(self.text) > 100 else self.text,
            'timestamp': self.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            'emotions': {
                'joy': self.joy,
                'sadness': self.sadness,
                'anger': self.anger,
                'fear': self.fear,
                'surprise': self.surprise,
                'love': self.love,
                'neutral': self.neutral
            }
        }