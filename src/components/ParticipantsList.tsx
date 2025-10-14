import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Users, QrCode, Award, CheckCircle, XCircle, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useApp } from '../contexts/AppContext';
import { QRDisplay } from './QRDisplay';

export function ParticipantsList() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { events, participants, markAttendance, issueCertificate, user } = useApp();
  const [selectedParticipant, setSelectedParticipant] = useState<string>('');
  const [showQR, setShowQR] = useState(false);

  if (!user?.isAdmin) {
    navigate('/login');
    return null;
  }

  const event = events.find(e => e.id === eventId);
  const eventParticipants = participants.filter(p => p.eventId === eventId);

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Event not found</h2>
          <Link to="/admin">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleShowQR = (participantId: string) => {
    setSelectedParticipant(participantId);
    setShowQR(true);
  };

  const getSelectedParticipant = () => {
    return eventParticipants.find(p => p.id === selectedParticipant);
  };

  const attendanceRate = eventParticipants.length > 0 
    ? (eventParticipants.filter(p => p.attended).length / eventParticipants.length) * 100 
    : 0;

  const certificateRate = eventParticipants.length > 0 
    ? (eventParticipants.filter(p => p.certificateIssued).length / eventParticipants.length) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link to="/admin">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded"></div>
              <span className="text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EventHub Admin
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Event Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={event.image}
              alt={event.title}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <h1 className="text-3xl text-gray-800">{event.title}</h1>
              <p className="text-gray-600">
                {new Date(event.date).toLocaleDateString()} at {event.time} • {event.venue}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-white/70 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Participants</p>
                  <p className="text-2xl text-blue-600">{eventParticipants.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Attended</p>
                  <p className="text-2xl text-green-600">
                    {eventParticipants.filter(p => p.attended).length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Attendance Rate</p>
                  <p className="text-2xl text-purple-600">{attendanceRate.toFixed(1)}%</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-500 text-sm">%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Certificates</p>
                  <p className="text-2xl text-orange-600">
                    {eventParticipants.filter(p => p.certificateIssued).length}
                  </p>
                </div>
                <Award className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Participants Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/70 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Event Participants</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {eventParticipants.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Participant</TableHead>
                        <TableHead>Team Members</TableHead>
                        <TableHead>Registration Date</TableHead>
                        <TableHead>Attendance</TableHead>
                        <TableHead>Certificate</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {eventParticipants.map((participant, index) => (
                        <motion.tr
                          key={participant.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="hover:bg-white/50"
                        >
                          <TableCell>
                            <div>
                              <p className="text-gray-800">{participant.userName}</p>
                              <p className="text-sm text-gray-500">{participant.userEmail}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {participant.teamMembers.length > 0 ? (
                              <div className="space-y-1">
                                {participant.teamMembers.map((member, idx) => (
                                  <div key={idx} className="text-sm">
                                    <p className="text-gray-700">{member.name}</p>
                                    <p className="text-gray-500 text-xs">{member.email}</p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-500 text-sm">Individual</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-600">
                              {new Date(participant.registrationDate).toLocaleDateString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant={participant.attended ? "default" : "secondary"}
                                className={participant.attended ? "bg-green-500" : "bg-gray-400"}
                              >
                                {participant.attended ? (
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                ) : (
                                  <XCircle className="w-3 h-3 mr-1" />
                                )}
                                {participant.attended ? 'Present' : 'Absent'}
                              </Badge>
                              {!participant.attended && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => markAttendance(participant.id)}
                                >
                                  Mark Present
                                </Button>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant={participant.certificateIssued ? "default" : "secondary"}
                                className={participant.certificateIssued ? "bg-orange-500" : "bg-gray-400"}
                              >
                                {participant.certificateIssued ? (
                                  <Award className="w-3 h-3 mr-1" />
                                ) : (
                                  <XCircle className="w-3 h-3 mr-1" />
                                )}
                                {participant.certificateIssued ? 'Issued' : 'Pending'}
                              </Badge>
                              {!participant.certificateIssued && participant.attended && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => issueCertificate(participant.id)}
                                >
                                  Issue
                                </Button>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleShowQR(participant.id)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View QR
                            </Button>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No participants registered yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* QR Display Modal */}
      {showQR && selectedParticipant && (
        <QRDisplay
          qrCode={getSelectedParticipant()?.qrCode || ''}
          eventTitle={event.title}
          onClose={() => setShowQR(false)}
        />
      )}
    </div>
  );
}