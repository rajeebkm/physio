import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../contexts/AuthContext';

export const HomeScreen: React.FC = () => {
    const { user } = useAuth();

    const quickActions = [
        {
            id: 'book-appointment',
            title: 'Book Appointment',
            subtitle: 'Consult with doctors',
            icon: 'event',
            color: '#3B82F6',
        },
        {
            id: 'video-consultation',
            title: 'Video Consultation',
            subtitle: 'Instant video call',
            icon: 'videocam',
            color: '#10B981',
        },
        {
            id: 'find-therapist',
            title: 'Find Therapist',
            subtitle: 'Nearby physiotherapists',
            icon: 'person-search',
            color: '#F59E0B',
        },
        {
            id: 'exercise-plan',
            title: 'Exercise Plan',
            subtitle: 'Personalized workouts',
            icon: 'fitness-center',
            color: '#EF4444',
        },
    ];

    const recentActivities = [
        {
            id: '1',
            title: 'Dr. Sarah Johnson',
            subtitle: 'Cardiology Consultation',
            time: '2 hours ago',
            type: 'consultation',
        },
        {
            id: '2',
            title: 'Physiotherapy Session',
            subtitle: 'Back pain treatment',
            time: 'Yesterday',
            type: 'therapy',
        },
        {
            id: '3',
            title: 'Lab Test Results',
            subtitle: 'Blood work completed',
            time: '2 days ago',
            type: 'lab',
        },
    ];

    const renderQuickAction = (action: any) => (
        <TouchableOpacity
            key={action.id}
            style={[styles.quickActionCard, { borderLeftColor: action.color }]}
            activeOpacity={0.7}
        >
            <View style={styles.quickActionContent}>
                <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                    <Icon name={action.icon} size={24} color="#fff" />
                </View>
                <View style={styles.quickActionText}>
                    <Text style={styles.quickActionTitle}>{action.title}</Text>
                    <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
                </View>
                <Icon name="chevron-right" size={24} color="#9CA3AF" />
            </View>
        </TouchableOpacity>
    );

    const renderRecentActivity = (activity: any) => (
        <TouchableOpacity
            key={activity.id}
            style={styles.activityCard}
            activeOpacity={0.7}
        >
            <View style={styles.activityIcon}>
                <Icon
                    name={
                        activity.type === 'consultation'
                            ? 'medical-services'
                            : activity.type === 'therapy'
                                ? 'fitness-center'
                                : 'science'
                    }
                    size={20}
                    color="#3B82F6"
                />
            </View>
            <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activitySubtitle}>{activity.subtitle}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
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
                <View style={styles.headerContent}>
                    <View>
                        <Text style={styles.greeting}>Good morning,</Text>
                        <Text style={styles.userName}>{user?.firstName || 'User'}</Text>
                    </View>
                    <TouchableOpacity style={styles.notificationButton}>
                        <Icon name="notifications" size={24} color="#fff" />
                        <View style={styles.notificationBadge} />
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Quick Actions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.quickActionsGrid}>
                        {quickActions.map(renderQuickAction)}
                    </View>
                </View>

                {/* Health Summary */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Health Summary</Text>
                    <View style={styles.healthSummaryCard}>
                        <View style={styles.healthMetric}>
                            <Text style={styles.healthMetricValue}>12</Text>
                            <Text style={styles.healthMetricLabel}>Consultations</Text>
                        </View>
                        <View style={styles.healthMetric}>
                            <Text style={styles.healthMetricValue}>8</Text>
                            <Text style={styles.healthMetricLabel}>Therapy Sessions</Text>
                        </View>
                        <View style={styles.healthMetric}>
                            <Text style={styles.healthMetricValue}>95%</Text>
                            <Text style={styles.healthMetricLabel}>Recovery Rate</Text>
                        </View>
                    </View>
                </View>

                {/* Recent Activities */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Activities</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAllText}>See All</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.activitiesList}>
                        {recentActivities.map(renderRecentActivity)}
                    </View>
                </View>

                {/* Upcoming Appointments */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
                    <View style={styles.appointmentCard}>
                        <View style={styles.appointmentIcon}>
                            <Icon name="event" size={24} color="#3B82F6" />
                        </View>
                        <View style={styles.appointmentContent}>
                            <Text style={styles.appointmentTitle}>Dr. Michael Chen</Text>
                            <Text style={styles.appointmentSubtitle}>Physiotherapy Session</Text>
                            <Text style={styles.appointmentTime}>Tomorrow, 2:00 PM</Text>
                        </View>
                        <TouchableOpacity style={styles.joinButton}>
                            <Text style={styles.joinButtonText}>Join</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        paddingTop: 20,
        paddingBottom: 30,
        paddingHorizontal: 20,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    greeting: {
        color: '#fff',
        fontSize: 16,
        opacity: 0.9,
    },
    userName: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 4,
    },
    notificationButton: {
        position: 'relative',
        padding: 8,
    },
    notificationBadge: {
        position: 'absolute',
        top: 4,
        right: 4,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EF4444',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    section: {
        marginTop: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    seeAllText: {
        fontSize: 14,
        color: '#3B82F6',
        fontWeight: '600',
    },
    quickActionsGrid: {
        gap: 12,
    },
    quickActionCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    quickActionContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quickActionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    quickActionText: {
        flex: 1,
    },
    quickActionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    quickActionSubtitle: {
        fontSize: 14,
        color: '#6B7280',
    },
    healthSummaryCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    healthMetric: {
        alignItems: 'center',
    },
    healthMetricValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#3B82F6',
    },
    healthMetricLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
    },
    activitiesList: {
        gap: 12,
    },
    activityCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
    },
    activityIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EBF4FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    activityContent: {
        flex: 1,
    },
    activityTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    activitySubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 4,
    },
    activityTime: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    appointmentCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    appointmentIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#EBF4FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    appointmentContent: {
        flex: 1,
    },
    appointmentTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    appointmentSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 4,
    },
    appointmentTime: {
        fontSize: 12,
        color: '#3B82F6',
        fontWeight: '500',
    },
    joinButton: {
        backgroundColor: '#3B82F6',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    joinButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
});
