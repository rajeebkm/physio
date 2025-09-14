import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    FlatList,
    RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const appointments = [
    {
        id: '1',
        provider: 'Dr. Sarah Johnson',
        specialty: 'Cardiology',
        type: 'Video Consultation',
        date: '2024-01-16',
        time: '2:00 PM',
        duration: '30 min',
        status: 'Upcoming',
        statusColor: '#3B82F6',
    },
    {
        id: '2',
        provider: 'Dr. Michael Chen',
        specialty: 'Physiotherapy',
        type: 'In-Person',
        date: '2024-01-15',
        time: '10:00 AM',
        duration: '45 min',
        status: 'Completed',
        statusColor: '#10B981',
    },
    {
        id: '3',
        provider: 'Dr. Emily Davis',
        specialty: 'General Medicine',
        type: 'Video Consultation',
        date: '2024-01-14',
        time: '3:30 PM',
        duration: '25 min',
        status: 'Completed',
        statusColor: '#10B981',
    },
    {
        id: '4',
        provider: 'Dr. Rajesh Kumar',
        specialty: 'Orthopedics',
        type: 'In-Person',
        date: '2024-01-13',
        time: '11:00 AM',
        duration: '40 min',
        status: 'Cancelled',
        statusColor: '#EF4444',
    },
];

const tabs = ['Upcoming', 'Completed', 'Cancelled'];

export const AppointmentsScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Upcoming');
    const [refreshing, setRefreshing] = useState(false);

    const filteredAppointments = appointments.filter(appointment => {
        if (activeTab === 'Upcoming') {
            return appointment.status === 'Upcoming';
        } else if (activeTab === 'Completed') {
            return appointment.status === 'Completed';
        } else if (activeTab === 'Cancelled') {
            return appointment.status === 'Cancelled';
        }
        return true;
    });

    const onRefresh = () => {
        setRefreshing(true);
        // Simulate API call
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    };

    const renderAppointment = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.appointmentCard}>
            <View style={styles.appointmentHeader}>
                <View style={styles.providerInfo}>
                    <View style={styles.providerImage}>
                        <Icon name="person" size={24} color="#6B7280" />
                    </View>
                    <View style={styles.providerDetails}>
                        <Text style={styles.providerName}>{item.provider}</Text>
                        <Text style={styles.providerSpecialty}>{item.specialty}</Text>
                    </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: item.statusColor + '20' }]}>
                    <Text style={[styles.statusText, { color: item.statusColor }]}>
                        {item.status}
                    </Text>
                </View>
            </View>

            <View style={styles.appointmentDetails}>
                <View style={styles.detailRow}>
                    <Icon name="event" size={16} color="#6B7280" />
                    <Text style={styles.detailText}>{item.date}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Icon name="access-time" size={16} color="#6B7280" />
                    <Text style={styles.detailText}>{item.time}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Icon name="schedule" size={16} color="#6B7280" />
                    <Text style={styles.detailText}>{item.duration}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Icon name={item.type === 'Video Consultation' ? 'videocam' : 'location-on'} size={16} color="#6B7280" />
                    <Text style={styles.detailText}>{item.type}</Text>
                </View>
            </View>

            {item.status === 'Upcoming' && (
                <View style={styles.appointmentActions}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>Reschedule</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
                        <Text style={[styles.actionButtonText, styles.primaryButtonText]}>
                            Join Call
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {item.status === 'Completed' && (
                <View style={styles.appointmentActions}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>View Prescription</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>Rate & Review</Text>
                    </TouchableOpacity>
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />

            {/* Header */}
            <LinearGradient
                colors={['#3B82F6', '#1E40AF']}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>Appointments</Text>
                <Text style={styles.headerSubtitle}>Manage your consultations</Text>
            </LinearGradient>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[
                            styles.tab,
                            activeTab === tab && styles.activeTab,
                        ]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === tab && styles.activeTabText,
                            ]}
                        >
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Appointments List */}
            <View style={styles.content}>
                <FlatList
                    data={filteredAppointments}
                    renderItem={renderAppointment}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.appointmentsList}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#3B82F6']}
                            tintColor="#3B82F6"
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Icon name="event-busy" size={64} color="#D1D5DB" />
                            <Text style={styles.emptyTitle}>No appointments found</Text>
                            <Text style={styles.emptySubtitle}>
                                {activeTab === 'Upcoming'
                                    ? 'You have no upcoming appointments'
                                    : `You have no ${activeTab.toLowerCase()} appointments`
                                }
                            </Text>
                        </View>
                    }
                />
            </View>

            {/* Floating Action Button */}
            <TouchableOpacity style={styles.fab}>
                <Icon name="add" size={24} color="#fff" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        paddingHorizontal: 24,
        paddingVertical: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    activeTab: {
        backgroundColor: '#3B82F6',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
    },
    activeTabText: {
        color: '#fff',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    appointmentsList: {
        paddingVertical: 16,
    },
    appointmentCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    appointmentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    providerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    providerImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    providerDetails: {
        flex: 1,
    },
    providerName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    providerSpecialty: {
        fontSize: 14,
        color: '#6B7280',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    appointmentDetails: {
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailText: {
        fontSize: 14,
        color: '#6B7280',
        marginLeft: 8,
    },
    appointmentActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        alignItems: 'center',
        marginHorizontal: 4,
    },
    primaryButton: {
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
    },
    primaryButtonText: {
        color: '#fff',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 64,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#3B82F6',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
    },
});
